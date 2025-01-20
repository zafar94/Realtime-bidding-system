import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './item.entity';

describe('ItemsService', () => {
  let service: ItemsService;

  const mockItems = [
    { id: 1, name: 'Item 1', startingPrice: 100 },
    { id: 2, name: 'Item 2', startingPrice: 200 },
  ];

  const mockItemsRepository = {
    find: jest.fn().mockResolvedValue(mockItems),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemsRepository,
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
      expect(items).toEqual(mockItems);
      expect(mockItemsRepository.find).toHaveBeenCalled();
    });
  });
});
