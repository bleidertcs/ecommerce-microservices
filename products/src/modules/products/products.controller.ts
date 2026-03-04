import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchProductDto } from './dtos/search-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PublicRoute } from '../../common/decorators/public.decorator';
import { AuthUser } from '../../common/decorators/auth-user.decorator';

@ApiTags('Products')
@ApiBearerAuth('accessToken')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @PublicRoute()
  @Get()
  @ApiOperation({ summary: 'Get products with optional filtering' })
  async findAll(@Query() query: SearchProductDto) {
    return this.productsService.findAll(query);
  }

  @PublicRoute()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@AuthUser() user: { id?: string }, @Body() dto: CreateProductDto) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @AuthUser() user: { id?: string },
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  async remove(@AuthUser() user: { id?: string }, @Param('id') id: string) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.productsService.remove(id);
  }

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any) {
    Logger.log(`Received order.created event for Order ${data.orderId}`, 'ProductsController');
    if (data.items && Array.isArray(data.items)) {
      await this.productsService.processOrderItems(data.items);
    }
  }
}
