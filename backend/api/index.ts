import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

export default async function handler(req, res) {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Vercel handles CORS usually, but safe to keep
  
  // Important: Initialize the app, but don't listen on a port
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
