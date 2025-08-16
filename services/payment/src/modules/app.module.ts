import { Module } from "@nestjs/common";
import { PaymentController } from "../rest/payment.controller";
import { PaymentService } from "../services/payment.service";
import { MetricsController } from "../rest/metrics.controller";

@Module({
  controllers: [PaymentController, MetricsController],
  providers: [PaymentService],
})
export class AppModule {}