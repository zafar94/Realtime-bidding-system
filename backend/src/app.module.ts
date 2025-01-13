import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/item.entity';
import { Bid } from './bids/bid.entity';
import { AuctionGateway } from './auction/auction.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: [Item, Bid],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    ItemsModule,
    BidsModule,
  ],
  providers: [AuctionGateway],
})
export class AppModule { }
