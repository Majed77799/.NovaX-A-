"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const lru_cache_1 = require("lru-cache");
const etag_1 = __importDefault(require("etag"));
const zod_1 = require("zod");
// ---------- Config ----------
const PORT = process.env.PORT ? Number(process.env.PORT) : 7070;
// Cache TTLs (ms)
const TTL_OVERVIEW = 15 * 60 * 1000; // 15m
const TTL_CATEGORY = 30 * 60 * 1000; // 30m
const TTL_PRODUCT = 60 * 60 * 1000; // 60m
const TTL_GEO = 30 * 60 * 1000; // 30m
// LRU Cache
const cache = new lru_cache_1.LRUCache({
    max: 500,
    ttlAutopurge: true,
});
// Simulate provider keys presence
const PROVIDER_KEYS = {
    primary: process.env.PROVIDER_KEY ?? '',
    secondary: process.env.SECONDARY_KEY ?? '',
};
function providerKeysAvailable() {
    return Boolean(PROVIDER_KEYS.primary && PROVIDER_KEYS.secondary);
}
// ---------- Helpers ----------
function makeCacheKey(req) {
    const url = req.originalUrl;
    const accept = req.headers['accept'] || '';
    return crypto_1.default.createHash('sha256').update(url + '|' + accept).digest('hex');
}
function setCachingHeaders(res, ttlMs, entityTag) {
    const now = Date.now();
    const maxAgeSec = Math.floor(ttlMs / 1000);
    res.setHeader('ETag', entityTag);
    res.setHeader('Cache-Control', `public, max-age=${maxAgeSec}`);
    res.setHeader('Expires', new Date(now + ttlMs).toUTCString());
}
function respondWithCache(req, res, payload, ttlMs) {
    const bodyStr = JSON.stringify(payload);
    const tag = (0, etag_1.default)(bodyStr);
    setCachingHeaders(res, ttlMs, tag);
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch === tag) {
        res.status(304).end();
        return;
    }
    res.type('application/json').send(bodyStr);
}
function tryGetCached(req) {
    const key = makeCacheKey(req);
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return { body: entry.body, etag: entry.etag };
}
function setCache(req, body, ttlMs) {
    const key = makeCacheKey(req);
    const bodyStr = JSON.stringify(body);
    const tag = (0, etag_1.default)(bodyStr);
    cache.set(key, { body, etag: tag, expiresAt: Date.now() + ttlMs }, { ttl: ttlMs });
}
function safeHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            // Never crash; return 500 with minimal info
            /* eslint-disable no-console */
            console.error('Unhandled error:', error);
            res.status(500).json({ error: 'internal_error' });
        }
    };
}
// ---------- Validation Schemas ----------
const tfEnum = zod_1.z.enum(['7', '30', '90']);
const bool01 = zod_1.z.enum(['0', '1']);
const overviewQuerySchema = zod_1.z.object({
    tf: tfEnum.default('30'),
    region: zod_1.z.string().default('global'),
    lang: zod_1.z.string().default('en'),
    pred: bool01.default('0'),
});
const categoryQuerySchema = zod_1.z.object({
    name: zod_1.z.string(),
    tf: tfEnum.default('30'),
    region: zod_1.z.string().default('global'),
    lang: zod_1.z.string().default('en'),
    pred: bool01.default('0'),
});
const productQuerySchema = zod_1.z.object({
    id: zod_1.z.string(),
});
const geoQuerySchema = zod_1.z.object({
    tf: tfEnum.default('30'),
});
// ---------- Mock Data ----------
function rand(seed) {
    let state = crypto_1.default.createHash('sha256').update(seed).digest().readUInt32BE(0);
    return () => {
        // xorshift32
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return ((state >>> 0) % 100000) / 100000; // 0..1
    };
}
function generateSeries(length, base, volatility, r) {
    const series = [];
    let value = base;
    for (let i = 0; i < length; i++) {
        value = Math.max(0, value + (r() - 0.5) * volatility);
        series.push(Number(value.toFixed(2)));
    }
    return series;
}
function mockOverview(tf, region, lang, pred) {
    const days = Number(tf);
    const r = rand(`overview|${days}|${region}|${lang}|${pred}`);
    const orders = generateSeries(days, 1000, 120, r);
    const revenue = generateSeries(days, 25000, 3000, r);
    const visitors = generateSeries(days, 15000, 2000, r);
    const conv = orders.map((o, i) => (visitors[i] ? Number((o / visitors[i]).toFixed(4)) : 0));
    return {
        kpis: {
            orders: { current: orders.at(-1), wow: Number(((orders.at(-1) - orders.at(-2)) / orders.at(-2) * 100).toFixed(2)) },
            revenue: { current: revenue.at(-1), wow: Number(((revenue.at(-1) - revenue.at(-2)) / revenue.at(-2) * 100).toFixed(2)) },
            visitors: { current: visitors.at(-1), wow: Number(((visitors.at(-1) - visitors.at(-2)) / visitors.at(-2) * 100).toFixed(2)) },
            conversion: { current: conv.at(-1), wow: Number(((conv.at(-1) - conv.at(-2)) / conv.at(-2) * 100).toFixed(2)) },
        },
        series: { orders, revenue, visitors, conversion: conv },
        meta: { tf: days, region, lang, pred: pred === '1' },
    };
}
function mockCategory(name, tf, region, lang, pred) {
    const days = Number(tf);
    const r = rand(`category|${name}|${days}|${region}|${lang}|${pred}`);
    const items = Array.from({ length: 10 }).map((_, idx) => {
        const id = (0, uuid_1.v4)();
        const base = 100 + idx * 15 + Math.floor(r() * 50);
        const series = generateSeries(days, base, 20 + r() * 15, r);
        const growth = Number((((series.at(-1) - series[0]) / Math.max(1, series[0])) * 100).toFixed(2));
        return {
            id,
            name: `${name} Item ${idx + 1}`,
            price: Number((10 + r() * 90).toFixed(2)),
            units: series.at(-1),
            growth,
            confidence: Number((0.5 + r() * 0.5).toFixed(2)),
            sparkline: series,
        };
    });
    return { category: name, tf: days, region, lang, pred: pred === '1', items };
}
function mockProduct(id) {
    const r = rand(`product|${id}`);
    const days = 90;
    const history = generateSeries(days, 100 + r() * 40, 25 + r() * 20, r);
    const growth = Number((((history.at(-1) - history[0]) / Math.max(1, history[0])) * 100).toFixed(2));
    const suggestedPrice = Number((20 + r() * 80).toFixed(2));
    const confidence = Number((0.5 + r() * 0.5).toFixed(2));
    return {
        id,
        name: `Product ${id.slice(0, 8)}`,
        category: 'Misc',
        history,
        growth,
        confidence,
        suggestedPrice,
        attributes: {
            brand: 'Acme', color: ['Red', 'Blue', 'Green'][Math.floor(r() * 3)], size: ['S', 'M', 'L'][Math.floor(r() * 3)],
        },
    };
}
function mockGeo(tf) {
    const days = Number(tf);
    const r = rand(`geo|${days}`);
    const regions = ['na', 'eu', 'apac', 'latam', 'mea'];
    const buckets = regions.map((code) => ({
        code,
        score: Number((r() * 100).toFixed(2)),
        trend: generateSeries(days, 50 + r() * 50, 10 + r() * 10, r),
    }));
    return { tf: days, buckets };
}
// ---------- Express App ----------
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use((0, morgan_1.default)('tiny'));
// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));
// Middleware: serve from cache if fresh and ETag matches
function cacheMiddleware(ttlMs) {
    return safeHandler(async (req, res, next) => {
        const cached = tryGetCached(req);
        if (cached) {
            setCachingHeaders(res, ttlMs, cached.etag);
            const ifNoneMatch = req.headers['if-none-match'];
            if (ifNoneMatch && ifNoneMatch === cached.etag) {
                res.status(304).end();
                return;
            }
            res.json(cached.body);
            return;
        }
        next();
    });
}
// ---------- Routes ----------
app.get('/api/insights/overview', cacheMiddleware(TTL_OVERVIEW), safeHandler(async (req, res) => {
    const parse = overviewQuerySchema.safeParse(req.query);
    if (!parse.success) {
        res.status(400).json({ error: 'bad_request', details: parse.error.flatten() });
        return;
    }
    const { tf, region, lang, pred } = parse.data;
    let payload;
    if (!providerKeysAvailable()) {
        payload = mockOverview(tf, region, lang, pred);
    }
    else {
        // TODO: Replace with real provider call
        payload = mockOverview(tf, region, lang, pred);
    }
    setCache(req, payload, TTL_OVERVIEW);
    respondWithCache(req, res, payload, TTL_OVERVIEW);
}));
app.get('/api/insights/category', cacheMiddleware(TTL_CATEGORY), safeHandler(async (req, res) => {
    const parse = categoryQuerySchema.safeParse(req.query);
    if (!parse.success) {
        res.status(400).json({ error: 'bad_request', details: parse.error.flatten() });
        return;
    }
    const { name, tf, region, lang, pred } = parse.data;
    let payload;
    if (!providerKeysAvailable()) {
        payload = mockCategory(name, tf, region, lang, pred);
    }
    else {
        // TODO: Replace with real provider call
        payload = mockCategory(name, tf, region, lang, pred);
    }
    setCache(req, payload, TTL_CATEGORY);
    respondWithCache(req, res, payload, TTL_CATEGORY);
}));
app.get('/api/insights/product', cacheMiddleware(TTL_PRODUCT), safeHandler(async (req, res) => {
    const parse = productQuerySchema.safeParse(req.query);
    if (!parse.success) {
        res.status(400).json({ error: 'bad_request', details: parse.error.flatten() });
        return;
    }
    const { id } = parse.data;
    let payload;
    if (!providerKeysAvailable()) {
        payload = mockProduct(id);
    }
    else {
        // TODO: Replace with real provider call
        payload = mockProduct(id);
    }
    setCache(req, payload, TTL_PRODUCT);
    respondWithCache(req, res, payload, TTL_PRODUCT);
}));
app.get('/api/insights/geo', cacheMiddleware(TTL_GEO), safeHandler(async (req, res) => {
    const parse = geoQuerySchema.safeParse(req.query);
    if (!parse.success) {
        res.status(400).json({ error: 'bad_request', details: parse.error.flatten() });
        return;
    }
    const { tf } = parse.data;
    let payload;
    if (!providerKeysAvailable()) {
        payload = mockGeo(tf);
    }
    else {
        // TODO: Replace with real provider call
        payload = mockGeo(tf);
    }
    setCache(req, payload, TTL_GEO);
    respondWithCache(req, res, payload, TTL_GEO);
}));
// 404
app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
});
// Error handler (final)
app.use((err, _req, res, _next) => {
    /* eslint-disable no-console */
    console.error('Error handler caught:', err);
    res.status(500).json({ error: 'internal_error' });
});
if (require.main === module) {
    app.listen(PORT, () => {
        /* eslint-disable no-console */
        console.log(`API listening on http://localhost:${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map