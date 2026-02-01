import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../src/common/services/database.service';

describe('DatabaseService', () => {
    let service: DatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService],
        }).compile();

        service = module.get<DatabaseService>(DatabaseService);

        // Mock the PrismaClient methods
        service.$connect = jest.fn();
        service.$disconnect = jest.fn();
        service['logger'] = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should connect to database and log success', async () => {
            (service.$connect as jest.Mock).mockResolvedValue(undefined);

            await service.onModuleInit();

            expect(service.$connect).toHaveBeenCalled();
            expect(service['logger'].log).toHaveBeenCalledWith('Database connection established');
        });

        it('should log error and throw when connection fails', async () => {
            const error = new Error('Connection failed');
            (service.$connect as jest.Mock).mockRejectedValue(error);

            await expect(service.onModuleInit()).rejects.toThrow('Connection failed');

            expect(service['logger'].error).toHaveBeenCalledWith(
                'Failed to connect to database',
                error,
            );
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect from database and log success', async () => {
            (service.$disconnect as jest.Mock).mockResolvedValue(undefined);

            await service.onModuleDestroy();

            expect(service.$disconnect).toHaveBeenCalled();
            expect(service['logger'].log).toHaveBeenCalledWith('Database connection closed');
        });

        it('should log error when disconnect fails', async () => {
            const error = new Error('Disconnect failed');
            (service.$disconnect as jest.Mock).mockRejectedValue(error);

            await service.onModuleDestroy();

            expect(service['logger'].error).toHaveBeenCalledWith(
                'Error closing database connection',
                error,
            );
        });
    });

    describe('isHealthy', () => {
        it('should return healthy status when database is reachable', async () => {
            service.$queryRaw = jest.fn().mockResolvedValue([{ '?column?': 1 }]);

            const result = await service.isHealthy();

            expect(result).toEqual({
                database: {
                    status: 'up',
                    connection: 'active',
                },
            });
        });

        it('should return unhealthy status when database is unreachable', async () => {
            const error = new Error('Database unreachable');
            service.$queryRaw = jest.fn().mockRejectedValue(error);

            const result = await service.isHealthy();

            expect(result).toEqual({
                database: {
                    status: 'down',
                    connection: 'failed',
                    error: 'Database unreachable',
                },
            });
        });
    });
});
