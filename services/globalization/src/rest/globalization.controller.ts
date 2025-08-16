import { Body, Controller, Get, Post } from "@nestjs/common";
import { GlobalizationService } from "../services/globalization.service";

@Controller("/api/globalization")
export class GlobalizationController {
  constructor(private readonly service: GlobalizationService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("translate")
  translate(@Body() body: { text: string; to: string }) {
    return this.service.translate(body.text, body.to);
  }
}