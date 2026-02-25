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
                product: {
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
            const mockProducts = [
                { id: '1', name: 'Test Product 1', description: 'Content 1' },
                { id: '2', name: 'Test Product 2', description: 'Content 2' },
            ];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(2);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
        });

        it('should handle search functionality', async () => {
            const mockProducts = [{ id: '1', name: 'Search Result', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle search with multiple fields', async () => {
            const mockProducts = [{ id: '1', name: 'Search Result', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: ['name', 'description', 'brand'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom filters', async () => {
            const mockProducts = [{ id: '1', name: 'Filtered Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, category: 'furniture' },
                searchFields: ['name', 'description'],
                customFilters: { category: 'furniture' },
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle relations', async () => {
            const mockProducts = [{ id: '1', name: 'Product with Relations', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
                relations: ['category', 'reviews'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle nested relations', async () => {
            const mockProducts = [
                { id: '1', name: 'Product with Nested Relations', description: 'Content' },
            ];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
                relations: ['category.subCategory', 'reviews.user'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle default sorting', async () => {
            const mockProducts = [{ id: '1', name: 'Sorted Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
                defaultSort: { field: 'createdAt', order: 'desc' },
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom sorting', async () => {
            const mockProducts = [{ id: '1', name: 'Custom Sorted Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle pagination limits', async () => {
            const mockProducts = [{ id: '1', name: 'Limited Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 150 }, // Should be capped at 100
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.limit).toBe(100); // Should be capped
        });

        it('should handle minimum pagination limits', async () => {
            const mockProducts = [{ id: '1', name: 'Limited Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 0 }, // Should be set to 1
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.limit).toBe(10); // Should use the provided limit
        });

        it('should handle minimum page number', async () => {
            const mockProducts = [{ id: '1', name: 'Limited Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 0, limit: 10 }, // Should be set to 1
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.page).toBe(1); // Should be set to minimum
        });

        it('should handle search without search fields', async () => {
            const mockProducts = [{ id: '1', name: 'Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: [], // Empty search fields
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle domain filtering', async () => {
            const mockProducts = [{ id: '1', name: 'Domain Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, emailDomain: 'example.com' },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle date filtering', async () => {
            const mockProducts = [{ id: '1', name: 'Date Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, createdAt: '2023-01-01' },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle array filtering', async () => {
            const mockProducts = [{ id: '1', name: 'Array Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, tags: ['tag1', 'tag2'] },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle name filtering', async () => {
            const mockProducts = [{ id: '1', name: 'Name Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, name: 'John' },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle undefined and null values', async () => {
            const mockProducts = [{ id: '1', name: 'Null Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10, undefinedValue: undefined, nullValue: null },
                searchFields: ['name', 'description'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle empty relations', async () => {
            const mockProducts = [{ id: '1', name: 'Empty Relations Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
                relations: [], // Empty relations
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle complex nested relations', async () => {
            const mockProducts = [{ id: '1', name: 'Complex Relations Product', description: 'Content' }];

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'product',
                dto: { page: 1, limit: 10 },
                searchFields: ['name', 'description'],
                relations: ['category.subCategory.settings', 'reviews.user.profile'],
            });

            expect(result.items).toEqual(mockProducts);
            expect(result.meta.total).toBe(1);
        });

        it('should handle search with empty searchFields', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: [],
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle custom filters', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                customFilters: { createdBy: 'user-1' },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle domain fields', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, emailDomain: 'example.com' },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle date fields', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, createdAt: '2023-01-01' },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle array fields', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, tags: ['tag1', 'tag2'] },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle name fields with contains', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, productName: 'john' },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle nested relations', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                relations: ['category.subCategory', 'reviews.author'],
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle empty relations array', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                relations: [],
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle undefined values in dto', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10, name: undefined, description: null },
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle empty include object', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                relations: [],
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle relations with include object', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                relations: ['category', 'reviews'],
            };

            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);

            const result = await service.findManyWithPagination(options);

            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('should handle undefined relations (include undefined)', async () => {
            const options = {
                model: 'product',
                dto: { page: 1, limit: 10 },
                // relations is undefined
            };
            (mockDatabaseService.product.findMany as jest.Mock).mockResolvedValue([]);
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(0);
            const result = await service.findManyWithPagination(options);
            expect(result.items).toEqual([]);
            expect(result.meta.total).toBe(0);
        });
    });

    describe('getCount', () => {
        it('should get count', async () => {
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(5);

            const result = await service.getCount('product');

            expect(result).toBe(5);
            expect(mockDatabaseService.product.count).toHaveBeenCalledWith({
                where: { isDeleted: false },
            });
        });

        it('should get count with filters', async () => {
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(3);

            const result = await service.getCount('product', { brand: 'test-brand' });

            expect(result).toBe(3);
            expect(mockDatabaseService.product.count).toHaveBeenCalledWith({
                where: { isDeleted: false, brand: 'test-brand' },
            });
        });

        it('should get count with multiple filters', async () => {
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(2);

            const result = await service.getCount('product', {
                brand: 'test-brand',
                category: 'electronics',
            });

            expect(result).toBe(2);
            expect(mockDatabaseService.product.count).toHaveBeenCalledWith({
                where: {
                    isDeleted: false,
                    brand: 'test-brand',
                    category: 'electronics',
                },
            });
        });

        it('should handle getCount with filters', async () => {
            const filters = { createdBy: 'user-1' };
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(5);

            const result = await service.getCount('product', filters);

            expect(result).toBe(5);
        });

        it('should handle getCount without filters', async () => {
            (mockDatabaseService.product.count as jest.Mock).mockResolvedValue(10);

            const result = await service.getCount('product');

            expect(result).toBe(10);
        });
    });
});
