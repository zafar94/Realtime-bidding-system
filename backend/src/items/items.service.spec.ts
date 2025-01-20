import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;

  const mockItemRepository = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Item 1', startingPrice: 100 },
      { id: 2, name: 'Item 2', startingPrice: 200 },
    ]),
    create: jest.fn().mockImplementation((item) => ({
      id: Math.random(),
      ...item,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: 'ItemRepository',
          useValue: mockItemRepository,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getItems', () => {
    it('should return an array of items', async () => {
      const items = await service.getItems();
      expect(Array.isArray(items)).toBe(true);
      expect(items).toEqual([
        { id: 1, name: 'Item 1', startingPrice: 100 },
        { id: 2, name: 'Item 2', startingPrice: 200 },
      ]);
    });
  });

});
