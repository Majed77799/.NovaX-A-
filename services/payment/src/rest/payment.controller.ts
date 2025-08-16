import { Body, Controller, Get, Post } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";

@Controller("/api/payment")
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("checkout")
  async checkout(
    @Body() body: { amount: number; currency: string; provider: "stripe" | "paypal" }
  ) {
    return this.service.createCheckout(body);
  }
}