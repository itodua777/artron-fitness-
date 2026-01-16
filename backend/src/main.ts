
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    await app.listen(process.env.PORT || 5001);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
