import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
    ) { }

    async createItem(itemData: {
        name: string;
        description: string;
        startingPrice: number;
        auctionEndTime: Date;
    }): Promise<Item> {
        const item = this.itemsRepository.create(itemData);
        return this.itemsRepository.save(item);
    }

    async getItems(): Promise<Item[]> {
        return this.itemsRepository.find();
    }

    async getItemById(id: number): Promise<Item> {
        return this.itemsRepository.findOneBy({ id });
    }
}
