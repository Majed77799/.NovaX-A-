function hashStringToSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function randomInRange(rng, min, max) {
  return min + (max - min) * rng();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function generateDates(days) {
  const dates = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function generateTrendSeries(rng, length, startValue, dailyDriftPct, volatilityPct) {
  const series = [];
  let value = startValue;
  for (let i = 0; i < length; i++) {
    const drift = dailyDriftPct * value;
    const shock = (rng() * 2 - 1) * volatilityPct * value;
    value = Math.max(0, value + drift + shock);
    series.push(Number(value.toFixed(2)));
  }
  return series;
}

export function generateOverview({ tf = 30, region = 'global', lang = 'en', pred = 0, seedKey = '' } = {}) {
  const seed = hashStringToSeed(`overview|${tf}|${region}|${lang}|${pred}|${seedKey}`);
  const rng = mulberry32(seed);
  const dates = generateDates(Number(tf));

  const revenue = generateTrendSeries(rng, dates.length, randomInRange(rng, 50000, 120000), 0.002, 0.05);
  const volume = generateTrendSeries(rng, dates.length, randomInRange(rng, 800, 2500), 0.001, 0.08).map(v => Math.round(v));
  const price = generateTrendSeries(rng, dates.length, randomInRange(rng, 20, 120), 0.0015, 0.03);

  const totalRevenue = Number(revenue.reduce((a, b) => a + b, 0).toFixed(2));
  const avgPrice = Number((price.reduce((a, b) => a + b, 0) / price.length).toFixed(2));
  const items = Math.round(randomInRange(rng, 1200, 4200));
  const growthRatePct = Number(((revenue[revenue.length - 1] - revenue[0]) / Math.max(1, revenue[0]) * 100).toFixed(2));
  const categories = ['Electronics', 'Home', 'Beauty', 'Fashion', 'Sports', 'Automotive', 'Grocery'];
  const topCategory = categories[Math.floor(rng() * categories.length)];
  const trendingScore = Number((70 + rng() * 30).toFixed(1));

  const forecastHorizon = 7;
  const lastDate = new Date(dates[dates.length - 1]);
  const forecastDates = [];
  for (let i = 1; i <= forecastHorizon; i++) {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i);
    forecastDates.push(d.toISOString().slice(0, 10));
  }
  const forecastRevenue = generateTrendSeries(rng, forecastHorizon, revenue[revenue.length - 1], 0.002, 0.05);
  const forecastVolume = generateTrendSeries(rng, forecastHorizon, volume[volume.length - 1], 0.001, 0.08).map(v => Math.round(v));
  const forecastPrice = generateTrendSeries(rng, forecastHorizon, price[price.length - 1], 0.0015, 0.03);

  const body = {
    params: { tf: Number(tf), region, lang, pred: Number(pred) },
    kpis: {
      totalRevenue,
      avgPrice,
      items,
      growthRatePct,
      topCategory,
      trendingScore
    },
    series: { dates, revenue, volume, price },
    updatedAt: new Date().toISOString()
  };

  if (Number(pred) === 1) {
    body.forecast = {
      dates: forecastDates,
      revenue: forecastRevenue,
      volume: forecastVolume,
      price: forecastPrice
    };
  }

  return body;
}

export function generateCategory({ name = 'All', tf = 30, region = 'global', lang = 'en', pred = 0, seedKey = '' } = {}) {
  const seed = hashStringToSeed(`category|${name}|${tf}|${region}|${lang}|${pred}|${seedKey}`);
  const rng = mulberry32(seed);
  const itemCount = 20 + Math.floor(rng() * 20);
  const items = [];

  for (let i = 0; i < itemCount; i++) {
    const base = 50 + rng() * 150;
    const sparkLen = Math.min(30, Number(tf));
    const sparkline = generateTrendSeries(rng, sparkLen, base, 0.001, 0.07).map(v => Number(v.toFixed(2)));
    const price = Number((base + rng() * 20).toFixed(2));
    const growth7dPct = Number(((sparkline[sparkline.length - 1] - sparkline[Math.max(0, sparkline.length - 7)]) / Math.max(1, sparkline[Math.max(0, sparkline.length - 7)]) * 100).toFixed(2));
    const confidence = Number(clamp(0.6 + rng() * 0.4, 0, 1).toFixed(2));

    items.push({
      id: `item_${name.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`,
      name: `${name} Item ${i + 1}`,
      price,
      growth7dPct,
      confidence,
      sparkline
    });
  }

  return {
    params: { name, tf: Number(tf), region, lang, pred: Number(pred) },
    category: name,
    items,
    updatedAt: new Date().toISOString()
  };
}

export function generateProduct({ id = 'prod_1', tf = 90, seedKey = '' } = {}) {
  const seed = hashStringToSeed(`product|${id}|${tf}|${seedKey}`);
  const rng = mulberry32(seed);
  const dates = generateDates(Number(tf));
  const price = generateTrendSeries(rng, dates.length, randomInRange(rng, 15, 300), 0.001, 0.04);
  const volume = generateTrendSeries(rng, dates.length, randomInRange(rng, 100, 3000), 0.001, 0.09).map(v => Math.round(v));

  function pct(a, b) { return Number(((a - b) / Math.max(1, b) * 100).toFixed(2)); }
  const lastIdx = dates.length - 1;
  const growthPct = {
    d7: pct(price[lastIdx], price[Math.max(0, lastIdx - 7)]),
    d30: pct(price[lastIdx], price[Math.max(0, lastIdx - 30)]),
    d90: pct(price[lastIdx], price[0])
  };

  const confidence = Number((0.65 + rng() * 0.3).toFixed(2));
  const suggestedPrice = Number((price[lastIdx] * (1 + clamp(growthPct.d30 / 200, -0.1, 0.15))).toFixed(2));

  return {
    id,
    name: `Product ${id.replace(/^[^_]*_?/, '')}`,
    history: { dates, price, volume },
    growthPct,
    confidence,
    suggestedPrice,
    currency: 'USD',
    rationale: 'Suggested price considers recent momentum, volatility, and volume trends.',
    updatedAt: new Date().toISOString()
  };
}

export function generateGeo({ tf = 30, seedKey = '' } = {}) {
  const seed = hashStringToSeed(`geo|${tf}|${seedKey}`);
  const rng = mulberry32(seed);
  const regions = ['US', 'CA', 'MX', 'BR', 'AR', 'GB', 'FR', 'DE', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'PL', 'RU', 'CN', 'JP', 'KR', 'IN', 'AU', 'NZ', 'ZA', 'NG', 'EG', 'AE', 'SA'];
  const buckets = regions.map(code => ({ region: code, value: Number((rng() * 100).toFixed(2)) }));
  let min = Infinity, max = -Infinity;
  for (const b of buckets) { if (b.value < min) min = b.value; if (b.value > max) max = b.value; }
  return {
    params: { tf: Number(tf) },
    buckets,
    min,
    max,
    updatedAt: new Date().toISOString()
  };
}