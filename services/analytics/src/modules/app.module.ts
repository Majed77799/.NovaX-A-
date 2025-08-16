import { Module } from "@nestjs/common";
import { AnalyticsController } from "../rest/analytics.controller";
import { AnalyticsService } from "../services/analytics.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [AnalyticsController, MetricsController],
  providers: [AnalyticsService],
})
export class AppModule {}