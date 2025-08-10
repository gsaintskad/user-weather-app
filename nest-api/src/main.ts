// nest-api/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Change the port here
  app.enableCors();
  await app.listen(4000);
}
bootstrap();