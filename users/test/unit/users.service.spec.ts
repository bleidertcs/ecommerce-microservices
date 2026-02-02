import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/users/users.service';
import { DatabaseService } from '../../src/common/services/database.service';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: any;

  beforeEach(async () => {
    databaseService = {
      user: {
        count: jest.fn(),
        createMany: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1', email: 'test@test.com' }];
      databaseService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      databaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      databaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });
  });
});
