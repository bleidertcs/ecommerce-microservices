import { Injectable, Logger, OnModuleInit, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '@/common/services/database.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateProductDto } from '@/modules/products/dtos/create-product.dto';
import { UpdateProductDto } from '@/modules/products/dtos/update-product.dto';
import { SearchProductDto } from '@/modules/products/dtos/search-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly databaseService: DatabaseService) { }

  async onModuleInit() {
    await this.seedIfEmpty();
  }

  async seedIfEmpty() {
    const count = await this.databaseService.product.count();
    if (count === 0) {
      this.logger.log('Seeding products from json...');
      try {
        const dataPath = path.join(process.cwd(), 'prisma', 'data', 'products.json');
        const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        await this.databaseService.product.createMany({ data: products });
        this.logger.log('Products seeded successfully');
      } catch (error) {
        this.logger.error('Failed to seed products automatically', error.stack);
      }
    }
  }

  async create(dto: CreateProductDto) {
    const sku = dto.sku ?? `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    if (dto.sku) {
      const existing = await this.databaseService.product.findUnique({ where: { sku: dto.sku } });
      if (existing) throw new ConflictException('Product with this SKU already exists');
    }
    const data = {
      name: dto.name,
      description: dto.description ?? null,
      sku,
      brand: dto.brand ?? null,
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.category ?? null,
      images: (dto.images?.length ? dto.images : null) as unknown as object,
      tags: dto.tags ?? [],
      featured: dto.featured ?? false,
    };
    const product = await this.databaseService.product.create({ data });
    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.databaseService.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    if (existing.isDeleted) throw new NotFoundException('Product not found');
    if (dto.sku && dto.sku !== existing.sku) {
      const duplicate = await this.databaseService.product.findUnique({ where: { sku: dto.sku } });
      if (duplicate) throw new ConflictException('Product with this SKU already exists');
    }
    const product = await this.databaseService.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.brand !== undefined && { brand: dto.brand }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.images !== undefined && { images: dto.images?.length ? (dto.images as unknown as object) : null }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
      },
    });
    this.logger.log(`Product updated: ${id}`);
    return product;
  }

  async remove(id: string) {
    const existing = await this.databaseService.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    await this.databaseService.product.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    this.logger.log(`Product soft-deleted: ${id}`);
    return { id };
  }

  async findAll(query?: SearchProductDto) {
    const { category, search, minPrice, maxPrice } = query || {};
    const where: any = { isDeleted: false };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    return this.databaseService.product.findMany({ where });
  }

  async findOne(id: string) {
    return this.databaseService.product.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async updateStock(id: string, quantity: number) {
    return this.databaseService.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }

  async processOrderItems(items: any[]) {
    for (const item of items) {
      if (item.productId && item.quantity) {
        try {
          await this.updateStock(item.productId, item.quantity);
          this.logger.log(`Deducted ${item.quantity} stock for product ${item.productId}`);
        } catch (error) {
          this.logger.error(`Failed to deduct stock for product ${item.productId}: ${error.message}`);
        }
      }
    }
  }
}
