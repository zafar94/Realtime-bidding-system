import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/item.entity';
import { Bid } from './bids/bid.entity';
import { AuctionGateway } from './auction/auction.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword',
      database: 'auction',
      entities: [Item, Bid],
      synchronize: true,
    }),

    ItemsModule,
    BidsModule,
  ],
  providers: [AuctionGateway],
})
export class AppModule {}
