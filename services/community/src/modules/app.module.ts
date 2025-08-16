import { Module } from "@nestjs/common";
import { CommunityController } from "../rest/community.controller";
import { CommunityService } from "../services/community.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [CommunityController, MetricsController],
  providers: [CommunityService],
})
export class AppModule {}