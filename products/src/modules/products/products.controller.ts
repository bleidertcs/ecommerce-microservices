import { Controller, Get, Param, NotFoundException, Query, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicRoute } from '../../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
@PublicRoute()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products with optional filtering' })
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any) {
    Logger.log(`Received order.created event for Order ${data.orderId}`, 'ProductsController');
    if (data.items && Array.isArray(data.items)) {
      await this.productsService.processOrderItems(data.items);
    }
  }
}
