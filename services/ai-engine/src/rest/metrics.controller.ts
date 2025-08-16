import { Controller, Get, Header } from "@nestjs/common";
import { metricsRegistry } from "@novax/common";

@Controller("/metrics")
export class MetricsController {
  @Get()
  @Header("Content-Type", "text/plain")
  async metrics(): Promise<string> {
    return metricsRegistry.metrics();
  }
}