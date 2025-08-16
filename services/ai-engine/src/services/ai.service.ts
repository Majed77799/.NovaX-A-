import { Injectable } from "@nestjs/common";
import { createQueue, enqueueJob } from "@novax/common";
import { Logger } from "@novax/common";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private readonly logger = new Logger("AiService");
  private readonly queue = createQueue({
    connectionUrl: process.env.REDIS_URL || "redis://localhost:6379",
    queueName: process.env.AI_QUEUE_NAME || "ai-engine-jobs",
  });
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async enqueueResearch(topic: string) {
    await enqueueJob(this.queue, "product-research", { topic });
    return { enqueued: true };
  }

  async enqueueProductGeneration(brief: string) {
    await enqueueJob(this.queue, "product-generation", { brief });
    return { enqueued: true };
  }

  async enqueueMarketing(productId: string, goal: string) {
    await enqueueJob(this.queue, "marketing-copilot", { productId, goal });
    return { enqueued: true };
  }

  async quickSuggestKeywords(topic: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You suggest 5 concise e-commerce keywords." },
          { role: "user", content: topic },
        ],
      });
      return response.choices[0]?.message?.content ?? "";
    } catch (err) {
      this.logger.error("OpenAI error", err);
      return "";
    }
  }
}