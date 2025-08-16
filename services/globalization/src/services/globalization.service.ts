import { Injectable } from "@nestjs/common";
import translateApi from "@vitalets/google-translate-api";

@Injectable()
export class GlobalizationService {
  async translate(text: string, to: string) {
    const res = await translateApi(text, { to } as any);
    return { text: (res as any).text, from: (res as any).from?.language?.iso || "auto", to };
  }
}