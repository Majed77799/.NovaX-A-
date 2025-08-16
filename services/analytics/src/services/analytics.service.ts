import { Injectable } from "@nestjs/common";
import { createCounter } from "@novax/common";

const eventsCounter = createCounter({ name: "novax_events_total", help: "Total analytics events", labelNames: ["name"] });

@Injectable()
export class AnalyticsService {
  private readonly events: Array<{ name: string; userId?: string; properties?: Record<string, unknown>; ts: number }> = [];

  trackEvent(name: string, userId?: string, properties?: Record<string, unknown>) {
    this.events.push({ name, userId, properties, ts: Date.now() });
    eventsCounter.labels({ name }).inc();
    return { ok: true };
  }
}