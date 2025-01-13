import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { Item } from '../items/item.entity';
import { AuctionGateway } from '../auction/auction.gateway';
import { ItemsModule } from '../items/items.module';


@Module({
  imports: [TypeOrmModule.forFeature([Bid, Item]), ItemsModule],
  controllers: [BidsController],
  providers: [BidsService, AuctionGateway],
})
export class BidsModule { }
