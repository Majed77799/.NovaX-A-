import { Module } from "@nestjs/common";
import { AiController } from "../rest/ai.controller";
import { AiService } from "../services/ai.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [AiController, MetricsController],
  providers: [AiService],
})
export class AppModule {}