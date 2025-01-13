import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3001;

    await app.listen(port);
    console.log(`Application is running on: PORT:${port}`);
  } catch (error) {
    console.error('Error during application bootstrap', error);
    process.exit(1);
  }
}
bootstrap();
