import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../../common/services/database.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  async seedIfEmpty() {
    const count = await this.databaseService.product.count();
    if (count === 0) {
      this.logger.log('Seeding products...');
      const products = Array.from({ length: 20 }).map(() => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(10).toUpperCase(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
      }));
      await this.databaseService.product.createMany({ data: products });
      this.logger.log('Products seeded successfully');
    }
  }

  async findAll() {
    return this.databaseService.product.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.product.findUnique({ where: { id } });
  }

  async updateStock(id: string, quantity: number) {
    return this.databaseService.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}
