import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.use(helmet());
    app.use(cookieParser());

    app.enableCors({
        origin: configService.getOrThrow<string>('NEXT_PUBLIC_APP_URL'),
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    app.useGlobalFilters(new PrismaExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('WarmHeart API')
        .setDescription('API для WarmHeart — каталог, корзина, авторизация')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(configService.get<number>('SERVER_PORT') ?? 3000);
}
bootstrap();
