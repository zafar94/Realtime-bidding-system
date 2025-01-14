import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BidsService } from './bids.service';
import { Bid } from './bid.entity';

@Controller('bids')
export class BidsController {
    constructor(private readonly bidsService: BidsService) { }

    @Post()
    async placeBid(@Body() body: { itemId: number; userId: number; bidAmount: number }): Promise<Bid> {
        return this.bidsService.placeBid(body.itemId, body.userId, body.bidAmount);
    }

    @Get('item/:id')
    async getBidsForItem(@Param('id') itemId: number): Promise<Bid[]> {
        return this.bidsService.getBidsForItem(itemId);
    }
}
