import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { Item } from '../items/item.entity';
import { AuctionGateway } from '../auction/auction.gateway';

describe('BidsService', () => {
  let bidsService: BidsService;
  let bidsRepository: Repository<Bid>;
  let itemsRepository: Repository<Item>;
  let auctionGateway: AuctionGateway;

  beforeEach(async () => {
    const mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    const mockAuctionGateway = {
      sendAuctionUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        { provide: getRepositoryToken(Bid), useValue: mockRepository },
        { provide: getRepositoryToken(Item), useValue: mockRepository },
        { provide: AuctionGateway, useValue: mockAuctionGateway },
      ],
    }).compile();

    bidsService = module.get<BidsService>(BidsService);
    bidsRepository = module.get<Repository<Bid>>(getRepositoryToken(Bid));
    itemsRepository = module.get<Repository<Item>>(getRepositoryToken(Item));
    auctionGateway = module.get<AuctionGateway>(AuctionGateway);
  });

  it('should be defined', () => {
    expect(bidsService).toBeDefined();
  });

  describe('placeBid', () => {
    it('should place a valid bid and update the highest bid', async () => {
      const itemId = 1;
      const userId = 123;
      const bidAmount = 200;
      const currentTime = Math.floor(Date.now() / 1000);

      // Mock item
      jest.spyOn(itemsRepository, 'findOneBy').mockResolvedValue({
        id: itemId,
        highestBid: 150,
        endTime: currentTime + 500,
      } as Item);

      jest.spyOn(bidsRepository, 'create').mockReturnValue({
        item: { id: itemId } as Item,
        userId,
        amount: bidAmount,
        createdAt: new Date(),
      } as Bid);

      jest.spyOn(bidsRepository, 'save').mockResolvedValue({
        item: { id: itemId } as Item,
        userId,
        amount: bidAmount,
        createdAt: new Date(),
      } as Bid);

      jest.spyOn(itemsRepository, 'save').mockResolvedValue({
        id: itemId,
        highestBid: bidAmount,
        endTime: currentTime + 500,
      } as Item);

      const bid = await bidsService.placeBid(itemId, userId, bidAmount);
      expect(bid).toBeDefined();
      expect(bid.amount).toBe(bidAmount);
      expect(itemsRepository.save).toHaveBeenCalledWith({
        id: itemId,
        highestBid: bidAmount,
        endTime: currentTime + 500,
      });
      expect(auctionGateway.sendAuctionUpdate).toHaveBeenCalledWith(
        itemId,
        bidAmount,
        500,
      );
    });

    it('should throw an error if the item is not found', async () => {
      jest.spyOn(itemsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        bidsService.placeBid(1, 123, 200),
      ).rejects.toThrow('Item not found');
    });

    it('should throw an error if the auction has ended', async () => {
      const currentTime = Math.floor(Date.now() / 1000);

      jest.spyOn(itemsRepository, 'findOneBy').mockResolvedValue({
        id: 1,
        highestBid: 150,
        endTime: currentTime - 100,
      } as Item);

      await expect(
        bidsService.placeBid(1, 123, 200),
      ).rejects.toThrow('Auction has ended');
    });

    it('should throw an error if the bid is not higher than the current highest bid', async () => {
      const currentTime = Math.floor(Date.now() / 1000);

      jest.spyOn(itemsRepository, 'findOneBy').mockResolvedValue({
        id: 1,
        highestBid: 200,
        endTime: currentTime + 500,
      } as Item);

      await expect(
        bidsService.placeBid(1, 123, 150),
      ).rejects.toThrow('Bid must be higher than the current highest bid');
    });
  });

  describe('getBidsForItem', () => {
    it('should return all bids for an item', async () => {
      const itemId = 1;

      jest.spyOn(bidsRepository, 'find').mockResolvedValue([
        {
          id: 1,
          item: { id: itemId } as Item,
          userId: 123,
          amount: 150,
          createdAt: new Date(),
        },
      ] as Bid[]);

      const bids = await bidsService.getBidsForItem(itemId);

      expect(bids).toBeDefined();
      expect(bids).toHaveLength(1);
      expect(bidsRepository.find).toHaveBeenCalledWith({
        where: { item: { id: itemId } },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
