import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { Item } from '../items/item.entity';
import { AuctionGateway } from '../auction/auction.gateway';

@Injectable()
export class BidsService {
    constructor(
        @InjectRepository(Bid)
        private bidsRepository: Repository<Bid>,
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
        private auctionGateway: AuctionGateway,
    ) { }

    async placeBid(itemId: number, userId: number, bidAmount: number): Promise<Bid> {
        const item = await this.itemsRepository.findOneBy({ id: itemId });

        if (!item) {
            throw new Error('Item not found');
        }

        // if (item.duration) {
        //     throw new Error('Auction has ended');
        // }
        console.log(item, 'item')
        if (bidAmount <= item.highestBid) {
            throw new Error('Bid must be higher than the current highest bid');
        }

        const bid = this.bidsRepository.create({
            item,
            userId,
            amount: bidAmount,
            createdAt: new Date(),
        });

        item.highestBid = bidAmount;
        await this.itemsRepository.save(item);

        await this.auctionGateway.broadcastAuctionUpdate(itemId);

        return this.bidsRepository.save(bid);
    }

    async getBidsForItem(itemId: number): Promise<Bid[]> {
        return this.bidsRepository.find({
            where: { item: { id: itemId } },
            order: { createdAt: 'DESC' },
        });
    }


    

}
