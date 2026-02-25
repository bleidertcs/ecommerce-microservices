import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../src/modules/orders/orders.service';
import { DatabaseService } from '../../src/common/services/database.service';
import { CircuitBreakerService } from '../../src/common/services/circuit-breaker.service';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { of } from 'rxjs';

describe('OrdersService', () => {
  let service: OrdersService;
  let databaseService: any;
  let circuitBreakerService: any;
  let usersClient: any;
  let productsClient: any;
  let rmqClient: any;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    databaseService = {
      $transaction: jest.fn((cb) => cb(databaseService)),
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      outbox: {
        create: jest.fn(),
      },
    };

    circuitBreakerService = {
      fire: jest.fn(),
    };

    usersClient = {
      getService: jest.fn().mockReturnValue(mockUsersService),
    };

    productsClient = {
      getService: jest.fn().mockReturnValue(mockProductsService),
    };

    rmqClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: DatabaseService, useValue: databaseService },
        { provide: CircuitBreakerService, useValue: circuitBreakerService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('grpc') } },
        { provide: 'USERS_PACKAGE', useValue: usersClient },
        { provide: 'PRODUCTS_PACKAGE', useValue: productsClient },
        { provide: 'RABBITMQ_SERVICE', useValue: rmqClient },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const userId = 'user-1';
      const items = [{ productId: 'prod-1', quantity: 2 }];
      const mockUser = { id: 'user-1', name: 'Test User' };
      const mockProduct = { id: 'prod-1', name: 'Product 1', price: 10, stock: 5 };
      const mockOrder = { id: 'order-1', userId, total: 20, createdAt: new Date() };

      circuitBreakerService.fire
        .mockResolvedValueOnce(mockUser) // First call for user
        .mockResolvedValueOnce(mockProduct); // Second call for product

      databaseService.order.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder(userId, items);

      expect(result).toEqual(mockOrder);
      expect(databaseService.order.create).toHaveBeenCalled();
      expect(databaseService.outbox.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          type: 'order.created',
        }),
      }));
    });

    it('should throw BadRequestException if user is not found', async () => {
      circuitBreakerService.fire.mockResolvedValueOnce(null);

      await expect(service.createOrder('user-1', [])).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if product stock is insufficient', async () => {
      const mockUser = { id: 'user-1' };
      const mockProduct = { id: 'prod-1', stock: 1 }; // Only 1 in stock

      circuitBreakerService.fire
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockProduct);

      await expect(service.createOrder('user-1', [{ productId: 'prod-1', quantity: 2 }]))
        .rejects.toThrow(BadRequestException);
    });
  });
});
