import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/modules/products/products.service';
import { DatabaseService } from '../../src/common/services/database.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let databaseService: any;

  beforeEach(async () => {
    databaseService = {
      product: {
        count: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      databaseService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: '1', name: 'Product 1' };
      databaseService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateStock', () => {
    it('should decrement stock', async () => {
      databaseService.product.update.mockResolvedValue({ id: '1', stock: 5 });
      
      const result = await service.updateStock('1', 2);
      expect(databaseService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { stock: { decrement: 2 } },
      });
    });
  });
});
