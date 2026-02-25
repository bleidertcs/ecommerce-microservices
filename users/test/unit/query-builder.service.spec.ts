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
                user: {
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
            const mockUsers = [
                { id: '1', username: 'user1', email: 'user1@example.com' },
                { id: '2', username: 'user2', email: 'user2@example.com' },
            ];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(2);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10 },
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.limit).toBe(10);
        });

        it('should handle search functionality', async () => {
            const mockUsers = [{ id: '1', username: 'Search Result', email: 'test@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle search with multiple fields', async () => {
            const mockUsers = [{ id: '1', username: 'Search Result', email: 'test@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom filters', async () => {
            const mockUsers = [{ id: '1', username: 'Filtered User', email: 'filter@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10, role: 'ADMIN' },
                searchFields: ['username', 'email'],
                customFilters: { role: 'ADMIN' },
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle relations', async () => {
            const mockUsers = [{ id: '1', username: 'User with Relations', email: 'rel@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10 },
                searchFields: ['username', 'email'],
                relations: ['orders', 'profile'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle default sorting', async () => {
            const mockUsers = [{ id: '1', username: 'Sorted User', email: 'sort@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10 },
                searchFields: ['username', 'email'],
                defaultSort: { field: 'createdAt', order: 'desc' },
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle custom sorting', async () => {
            const mockUsers = [{ id: '1', username: 'Custom Sorted User', email: 'custom@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10, sortBy: 'username', sortOrder: 'asc' },
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });

        it('should handle pagination limits', async () => {
            const mockUsers = [{ id: '1', username: 'Limited User', email: 'limit@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 150 }, // Should be capped at 100
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.limit).toBe(100); // Should be capped
        });

        it('should handle minimum pagination limits', async () => {
            const mockUsers = [{ id: '1', username: 'Limited User', email: 'limit@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 0 }, // Should be set to 1
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.limit).toBe(10); // Should use the provided limit
        });

        it('should handle minimum page number', async () => {
            const mockUsers = [{ id: '1', username: 'Limited User', email: 'limit@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 0, limit: 10 }, // Should be set to 1
                searchFields: ['username', 'email'],
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.page).toBe(1); // Should be set to minimum
        });

        it('should handle search without search fields', async () => {
            const mockUsers = [{ id: '1', username: 'User', email: 'user@example.com' }];

            (mockDatabaseService.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findManyWithPagination({
                model: 'user',
                dto: { page: 1, limit: 10, search: 'test' },
                searchFields: [], // Empty search fields
            });

            expect(result.items).toEqual(mockUsers);
            expect(result.meta.total).toBe(1);
        });
    });

    describe('getCount', () => {
        it('should get count', async () => {
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(5);

            const result = await service.getCount('user');

            expect(result).toBe(5);
            expect(mockDatabaseService.user.count).toHaveBeenCalledWith({
                where: { isDeleted: false },
            });
        });

        it('should get count with filters', async () => {
            (mockDatabaseService.user.count as jest.Mock).mockResolvedValue(3);

            const result = await service.getCount('user', { role: 'ADMIN' });

            expect(result).toBe(3);
            expect(mockDatabaseService.user.count).toHaveBeenCalledWith({
                where: { isDeleted: false, role: 'ADMIN' },
            });
        });
    });
});
