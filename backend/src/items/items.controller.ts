import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './item.entity';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Post()
    async createItem(@Body() itemData: { name: string; description: string; startingPrice: number; auctionEndTime: Date }): Promise<Item> {
        return this.itemsService.createItem(itemData);
    }

    @Get()
    async getItems(): Promise<Item[]> {
        return this.itemsService.getItems();
    }

    @Get(':id')
    async getItemById(@Param('id') id: number): Promise<Item> {
        return this.itemsService.getItemById(id);
    }
}
