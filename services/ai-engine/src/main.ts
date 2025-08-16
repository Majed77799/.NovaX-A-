import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { Logger } from "@novax/common";
import { createWorker } from "@novax/common";
import { config as loadDotEnv } from "dotenv";

loadDotEnv();

async function bootstrap() {
  const logger = new Logger("ai-engine");
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableShutdownHooks();

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  logger.info(`AI Engine listening on :${port}`);

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const queueName = process.env.AI_QUEUE_NAME || "ai-engine-jobs";

  const { worker } = createWorker({ connectionUrl: redisUrl, queueName }, async job => {
    logger.info(`Processing job ${job.name}`);
    // Placeholder; actual processing defined in processors/services
    return { ok: true };
  });

  worker.on("completed", job => logger.info(`Job completed ${job.id}`));
  worker.on("failed", (job, err) => logger.error(`Job failed ${job?.id}: ${err.message}`));
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});