import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  async seedIfEmpty() {
    const count = await this.databaseService.user.count();
    if (count === 0) {
      this.logger.log('Seeding users...');
      const users = Array.from({ length: 10 }).map(() => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
          email: faker.internet.email(),
          username: faker.internet.username({ firstName, lastName }),
          password: 'hashed_password_placeholder', // Should use bcrypt in real scenario
          firstName,
          lastName,
          shippingAddress: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
          },
          phone: faker.phone.number(),
        };
      });
      await this.databaseService.user.createMany({ data: users });
      this.logger.log('Users seeded successfully');
    }
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
