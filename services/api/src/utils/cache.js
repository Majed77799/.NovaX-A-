import LRUCache from 'lru-cache';
import etag from 'etag';
import { stableStringify } from './stableStringify.js';

const DEFAULT_MAX_ITEMS = Number(process.env.CACHE_MAX_ITEMS || 500);

export const cache = new LRUCache({
  max: DEFAULT_MAX_ITEMS
});

function normalizeQuery(query) {
  if (!query || typeof query !== 'object') return '';
  const keys = Object.keys(query).sort();
  const parts = [];
  for (const key of keys) {
    const value = query[key];
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    } else if (value && typeof value === 'object') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(stableStringify(value))}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.join('&');
}

export function createCacheKey(req) {
  const base = req.path || req.originalUrl || '';
  const query = normalizeQuery(req.query);
  return query ? `${base}?${query}` : base;
}

function computeEtagFromObject(obj) {
  const bodyString = stableStringify(obj);
  return etag(bodyString, { weak: false });
}

export function withCache(ttlSeconds, handler) {
  return async function cachedHandler(req, res, next) {
    try {
      const key = createCacheKey(req);
      const cached = cache.get(key);
      const ifNoneMatch = req.headers['if-none-match'];

      if (cached) {
        // Conditional GET against cached entry
        if (ifNoneMatch && cached.etag && ifNoneMatch === cached.etag) {
          res.set('ETag', cached.etag);
          res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
          return res.status(304).end();
        }
        res.set('ETag', cached.etag);
        res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
        return res.status(cached.status || 200).json(cached.body);
      }

      const result = await handler(req, res);
      const status = (result && result.status) || 200;
      const body = (result && (result.body ?? result)) || {};
      const entityTag = computeEtagFromObject(body);

      // Respect conditional GET
      if (ifNoneMatch && entityTag && ifNoneMatch === entityTag) {
        res.set('ETag', entityTag);
        res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
        cache.set(key, { status, body, etag: entityTag }, { ttl: ttlSeconds * 1000 });
        return res.status(304).end();
      }

      res.set('ETag', entityTag);
      res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
      cache.set(key, { status, body, etag: entityTag }, { ttl: ttlSeconds * 1000 });
      return res.status(status).json(body);
    } catch (error) {
      return next(error);
    }
  };
}