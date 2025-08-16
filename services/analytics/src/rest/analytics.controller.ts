import { Body, Controller, Get, Post } from "@nestjs/common";
import { AnalyticsService } from "../services/analytics.service";

@Controller("/api/analytics")
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("event")
  event(@Body() body: { name: string; userId?: string; properties?: Record<string, unknown> }) {
    return this.service.trackEvent(body.name, body.userId, body.properties);
  }
}