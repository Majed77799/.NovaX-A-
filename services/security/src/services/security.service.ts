import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

@Injectable()
export class SecurityService {
  private readonly jwtSecret = process.env.JWT_SECRET || "dev_secret";

  async login(email: string, _password: string) {
    const token = jwt.sign({ sub: email }, this.jwtSecret, { expiresIn: "1h" });
    return { token };
  }

  async watermark(content: string) {
    // TODO: Implement watermarking
    return `watermarked:${content}`;
  }
}