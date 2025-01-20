import { Test, TestingModule } from '@nestjs/testing';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Bid } from './bid.entity';

describe('BidsController', () => {
  let controller: BidsController;
  let service: BidsService;

  const mockBidsService = {
    placeBid: jest.fn(),
    getBidsForItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidsController],
      providers: [
        { provide: BidsService, useValue: mockBidsService },
      ],
    }).compile();

    controller = module.get<BidsController>(BidsController);
    service = module.get<BidsService>(BidsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('placeBid', () => {
    it('should call BidsService.placeBid and return the result', async () => {
      const mockBid = {
        id: 1,
        userId: 123,
        item: { id: 1 },
        amount: 200,
        createdAt: new Date(),
      } as Bid;

      mockBidsService.placeBid.mockResolvedValue(mockBid);

      const result = await controller.placeBid({
        itemId: 1,
        userId: 123,
        bidAmount: 200,
      });

      expect(service.placeBid).toHaveBeenCalledWith(1, 123, 200);
      expect(result).toEqual(mockBid);
    });

    it('should throw an error if the bid fails', async () => {
      mockBidsService.placeBid.mockRejectedValue(new Error('Bid failed'));

      await expect(
        controller.placeBid({
          itemId: 1,
          userId: 123,
          bidAmount: 200,
        }),
      ).rejects.toThrow('Bid failed');
    });
  });

  describe('getBidsForItem', () => {
    it('should call BidsService.getBidsForItem and return the result', async () => {
      const mockBids = [
        {
          id: 1,
          userId: 123,
          item: { id: 1 },
          amount: 200,
          createdAt: new Date(),
        },
      ] as Bid[];

      mockBidsService.getBidsForItem.mockResolvedValue(mockBids);

      const result = await controller.getBidsForItem(1);

      expect(service.getBidsForItem).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBids);
    });

    it('should return an empty array if there are no bids', async () => {
      mockBidsService.getBidsForItem.mockResolvedValue([]);

      const result = await controller.getBidsForItem(1);

      expect(service.getBidsForItem).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });
  });
});
