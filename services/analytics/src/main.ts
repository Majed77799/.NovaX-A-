import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { Logger } from "@novax/common";
import { config as loadDotEnv } from "dotenv";

loadDotEnv();

async function bootstrap() {
  const logger = new Logger("analytics");
  const app = await NestFactory.create(AppModule, { logger: false });
  const port = process.env.PORT ? Number(process.env.PORT) : 3007;
  await app.listen(port);
  logger.info(`Analytics listening on :${port}`);
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});