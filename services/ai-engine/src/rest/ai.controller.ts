import { Body, Controller, Get, Post } from "@nestjs/common";
import { AiService } from "../services/ai.service";

@Controller("/api/ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("health")
  health() {
    return { status: "ok" };
  }

  @Post("research")
  research(@Body() body: { topic: string }) {
    return this.aiService.enqueueResearch(body.topic);
  }

  @Post("generate-product")
  generateProduct(@Body() body: { brief: string }) {
    return this.aiService.enqueueProductGeneration(body.brief);
  }

  @Post("marketing-copilot")
  marketing(@Body() body: { productId: string; goal: string }) {
    return this.aiService.enqueueMarketing(body.productId, body.goal);
  }
}