import { Test, TestingModule } from '@nestjs/testing';
import { QueryBuilderService } from '../../src/common/services/query-builder.service';
import { DatabaseService } from '../../src/common/services/database.service';

describe('QueryBuilderService', () => {
    let service: QueryBuilderService;
    let mockDatabaseService: jest.Mocked<DatabaseService>;

    beforeEach(async () => {
        const mockDatabaseServiceProvider = {
            provide: DatabaseService,
            useValue: {
                order: {
                    findMany: jest.fn(),
                    count: jest.fn(),
                },
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [QueryBuilderService, mockDatabaseServiceProvider],
        }).compile();

        service = module.get<QueryBuilderService>(QueryBuilderService);
        mockDatabaseService = module.get(DatabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findManyWithPagination', () => {
        it('should find many with pagination', async () => {
            const mockOrders = [
                { id: '1', userId: 'user-1', total: 100 },
                { id: '2', userId: 'user-2', total: 200 },
            ];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(2);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10 },
                searchFields: ['userId', 'status'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
        });

        it('should handle search functionality', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10, search: 'user-1' },
                searchFields: ['userId'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle search with multiple fields', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10, search: 'user-1' },
                searchFields: ['userId', 'status'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom filters', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10, status: 'PAID' },
                searchFields: ['userId'],
                customFilters: { status: 'PAID' },
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle relations', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10 },
                searchFields: ['userId'],
                relations: ['items', 'user'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle default sorting', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10 },
                searchFields: ['userId'],
                defaultSort: { field: 'createdAt', order: 'desc' },
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom sorting', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10, sortBy: 'total', sortOrder: 'asc' },
                searchFields: ['userId'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle pagination limits', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 150 }, // Should be capped at 100
                searchFields: ['userId'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.limit).toBe(100); // Should be capped
        });

        it('should handle minimum pagination limits', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 0 }, // Should be set to minimum 1 but here checking behavior
                searchFields: ['userId'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.limit).toBe(10); // Default set in service
        });

        it('should handle minimum page number', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 0, limit: 10 }, // Should be set to 1
                searchFields: ['userId'],
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.page).toBe(1); // Should be set to minimum
        });

        it('should handle search without search fields', async () => {
            const mockOrders = [{ id: '1', userId: 'user-1', total: 100 }];

            (mockDatabaseService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'order',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: [], // Empty search fields
            });

            expect(result.items).toEqual(mockOrders);
            expect(result.meta.total).toBe(1);
        });

        it('should handle getCount', async () => {
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(5);

            const result = await service.getCount('order');

            expect(result).toBe(5);
            expect(mockDatabaseService.order.count).toHaveBeenCalledWith({
                where: { isDeleted: false },
            });
        });

        it('should handle getCount with filters', async () => {
            const filters = { userId: 'user-1' };
            (mockDatabaseService.order.count as jest.Mock).mockResolvedValue(5);

            const result = await service.getCount('order', filters);

            expect(result).toBe(5);
            expect(mockDatabaseService.order.count).toHaveBeenCalledWith({
                where: { isDeleted: false, userId: 'user-1' },
            });
        });
    });
});
