import { Module, OnModuleInit } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/item.entity';
import { Bid } from './bids/bid.entity';
import { User } from './users/user.entity';
import { AuctionGateway } from './auction/auction.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Item, Bid],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ItemsModule,
    BidsModule,
  ],
  providers: [AuctionGateway],
})

export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established');
    } catch (error) {
      console.error('Error initializing database connection:', error);
    }
  }
}