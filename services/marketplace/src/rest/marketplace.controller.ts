import { Body, Controller, Get, Post } from "@nestjs/common";
import { MarketplaceService } from "../services/marketplace.service";

@Controller("/api/marketplace")
export class MarketplaceController {
  constructor(private readonly service: MarketplaceService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("listings")
  createListing(@Body() body: { title: string; price: number }) {
    return this.service.createListing(body);
  }
}