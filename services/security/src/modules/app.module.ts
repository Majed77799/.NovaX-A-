import { Module } from "@nestjs/common";
import { SecurityController } from "../rest/security.controller";
import { SecurityService } from "../services/security.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [SecurityController, MetricsController],
  providers: [SecurityService],
})
export class AppModule {}