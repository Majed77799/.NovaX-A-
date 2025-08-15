import express from 'express';
import { withCache } from '../utils/cache.js';
import { generateOverview, generateCategory, generateProduct, generateGeo } from '../utils/mockData.js';

const router = express.Router();

const ttl = {
  overview: Number(process.env.TTL_OVERVIEW_SECS || 900),
  category: Number(process.env.TTL_CATEGORY_SECS || 1800),
  product: Number(process.env.TTL_PRODUCT_SECS || 3600),
  geo: Number(process.env.TTL_GEO_SECS || 3600)
};

function parseTf(raw) {
  const val = Number(raw);
  if ([7, 30, 90].includes(val)) return val;
  return 30;
}

function parsePred(raw) {
  const val = Number(raw);
  return val === 1 ? 1 : 0;
}

function isProviderAvailable() {
  return Boolean(process.env.DATA_PROVIDER_KEY || process.env.PROVIDER_API_KEY);
}

router.get('/overview', withCache(ttl.overview, async (req) => {
  const tf = parseTf(req.query.tf);
  const region = (req.query.region || 'global').toString();
  const lang = (req.query.lang || 'en').toString();
  const pred = parsePred(req.query.pred);

  if (!isProviderAvailable()) {
    const body = generateOverview({ tf, region, lang, pred, seedKey: req.ip || '' });
    return { status: 200, body };
  }

  // Provider-backed implementation placeholder: fall back to mock for now
  const body = generateOverview({ tf, region, lang, pred, seedKey: req.ip || '' });
  return { status: 200, body };
}));

router.get('/category', withCache(ttl.category, async (req) => {
  const name = (req.query.name || 'All').toString();
  const tf = parseTf(req.query.tf);
  const region = (req.query.region || 'global').toString();
  const lang = (req.query.lang || 'en').toString();
  const pred = parsePred(req.query.pred);

  if (!isProviderAvailable()) {
    const body = generateCategory({ name, tf, region, lang, pred, seedKey: req.ip || '' });
    return { status: 200, body };
  }

  const body = generateCategory({ name, tf, region, lang, pred, seedKey: req.ip || '' });
  return { status: 200, body };
}));

router.get('/product', withCache(ttl.product, async (req) => {
  const id = (req.query.id || 'prod_1').toString();
  if (!isProviderAvailable()) {
    const body = generateProduct({ id, tf: Number(req.query.tf || 90), seedKey: req.ip || '' });
    return { status: 200, body };
  }

  const body = generateProduct({ id, tf: Number(req.query.tf || 90), seedKey: req.ip || '' });
  return { status: 200, body };
}));

router.get('/geo', withCache(ttl.geo, async (req) => {
  const tf = parseTf(req.query.tf);
  if (!isProviderAvailable()) {
    const body = generateGeo({ tf, seedKey: req.ip || '' });
    return { status: 200, body };
  }

  const body = generateGeo({ tf, seedKey: req.ip || '' });
  return { status: 200, body };
}));

export default router;