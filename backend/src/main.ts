import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3001;

    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3002', 'http://example.com'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true);
          // callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await app.listen(port);
    console.log(`Application is running on: PORT:${port}`);
  } catch (error) {
    console.error('Error during application bootstrap', error);
    process.exit(1);
  }
}
bootstrap();
