import { Controller, Post, Body, Get, Param, UseGuards, Headers, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  async create(
    @Headers('x-user-id') userId: string,
    @Body() createOrderDto: { items: { productId: string; quantity: number; price: number }[] }
  ) {
    if (!userId) throw new NotFoundException('User identity not found in headers');
    return this.ordersService.createOrder(userId, createOrderDto.items);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  async findMyOrders(@Headers('x-user-id') userId: string) {
    if (!userId) throw new NotFoundException('User identity not found in headers');
    return this.ordersService.findByUser(userId);
  }
}
