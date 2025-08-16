import { Module } from "@nestjs/common";
import { GlobalizationController } from "../rest/globalization.controller";
import { GlobalizationService } from "../services/globalization.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [GlobalizationController, MetricsController],
  providers: [GlobalizationService],
})
export class AppModule {}