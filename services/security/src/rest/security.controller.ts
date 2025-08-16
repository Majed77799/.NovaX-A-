import { Body, Controller, Get, Post } from "@nestjs/common";
import { SecurityService } from "../services/security.service";

@Controller("/api/security")
export class SecurityController {
  constructor(private readonly service: SecurityService) {}

  @Get("health")
  health() { return { status: "ok" }; }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.service.login(body.email, body.password);
  }
}