import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DatabaseService } from '@/common/services/database.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('RABBITMQ_SERVICE') private readonly rmqClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  async seedIfEmpty() {
    const count = await this.databaseService.user.count();
    if (count === 0) {
      this.logger.log('Seeding users from json...');
      try {
        const dataPath = path.join(process.cwd(), 'prisma', 'data', 'users.json');
        const users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        await this.databaseService.user.createMany({ data: users });
        this.logger.log('Users seeded successfully');
      } catch (error) {
        this.logger.error('Failed to seed users automatically', error.stack);
      }
    }
  }

  async create(data: any) {
    const user = await this.databaseService.user.create({
      data: {
        ...data,
        shippingAddress: data.shippingAddress || {},
      },
    });

    this.logger.log(`User created: ${user.id}, emitting user.created event`);
    
    this.rmqClient.emit('user.created', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      timestamp: new Date(),
    });

    return user;
  }

  async syncUser(data: any) {
    const user = await this.databaseService.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.name || data.email,
      },
      create: {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.name || data.email,
        password: 'sso_user_no_password',
        shippingAddress: {},
      },
    });

    this.logger.log(`User synced from IDP: ${user.id}`);
    return user;
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }
}
