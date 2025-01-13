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
        duration: number;
    }): Promise<Item> {
        const newItem = {
            name: itemData.name,
            description: itemData.description,
            startingPrice: itemData.startingPrice,
            duration: itemData.duration,
            createdAt: new Date(),
        }
        const item = this.itemsRepository.create(newItem);
        console.log('item', item)
        return this.itemsRepository.save(item);
    }

    async getItems(): Promise<Item[]> {
        return this.itemsRepository.find();
    }

    async getItemById(id: number): Promise<Item> {
        return this.itemsRepository.findOneBy({ id });
    }
}
