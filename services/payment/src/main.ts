import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { Logger } from "@novax/common";
import { config as loadDotEnv } from "dotenv";

loadDotEnv();

async function bootstrap() {
  const logger = new Logger("payment");
  const app = await NestFactory.create(AppModule, { logger: false });
  const port = process.env.PORT ? Number(process.env.PORT) : 3003;
  await app.listen(port);
  logger.info(`Payment listening on :${port}`);
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});