import { Controller, Get, Post, Body, Param, NotFoundException, Headers, Patch, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PublicRoute } from '../../common/decorators/public.decorator';

@ApiTags('Orders')
@Controller('orders')
@PublicRoute()
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

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details by ID' })
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @Patch(':id/pay')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Simulate successful payment for an order' })
  async payOrder(@Param('id') id: string) {
    const order = await this.ordersService.payOrder(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
