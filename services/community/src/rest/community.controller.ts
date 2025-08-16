import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommunityService } from "../services/community.service";

@Controller("/api/community")
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("like")
  like(@Body() body: { postId: string; userId: string }) {
    return this.service.like(body.postId, body.userId);
  }
}