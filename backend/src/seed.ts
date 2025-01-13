import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { UserSeedService } from './users/user-seed.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const seedService = app.get(UserSeedService);

    await seedService.run();

    await app.close();
}

bootstrap().catch((error) => {
    console.error('Error running seed:', error);
    process.exit(1);
});
