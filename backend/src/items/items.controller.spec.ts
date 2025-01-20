import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  const mockItemsService = {
    getItems: jest.fn().mockResolvedValue([
      { id: 1, name: 'Item 1', startingPrice: 100 },
      { id: 2, name: 'Item 2', startingPrice: 200 },
    ]),
    createItem: jest.fn().mockImplementation((item) => ({
      id: Math.random(),
      ...item,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getItems', () => {
    it('should return an array of items', async () => {
      const result = await controller.getItems();
      expect(result).toEqual([
        { id: 1, name: 'Item 1', startingPrice: 100 },
        { id: 2, name: 'Item 2', startingPrice: 200 },
      ]);
      expect(service.getItems).toHaveBeenCalled();
    });
  });

  describe('createItem', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'New Item', startingPrice: 300, description: 'test desc', duration: 10 };
      const result = await controller.createItem(newItem);
      expect(result).toEqual(expect.objectContaining(newItem));
      expect(service.createItem).toHaveBeenCalledWith(newItem);
    });
  });
});
