import { Registry, collectDefaultMetrics, Counter, Gauge, Histogram } from "prom-client";

const registry = new Registry();
collectDefaultMetrics({ register: registry });

export const metricsRegistry = registry;

export function createCounter(options: { name: string; help: string; labelNames?: string[] }) {
  const metric = new Counter({ ...options, registers: [registry] });
  return metric;
}

export function createGauge(options: { name: string; help: string; labelNames?: string[] }) {
  const metric = new Gauge({ ...options, registers: [registry] });
  return metric;
}

export function createHistogram(options: { name: string; help: string; labelNames?: string[]; buckets?: number[] }) {
  const metric = new Histogram({ ...options, registers: [registry] });
  return metric;
}