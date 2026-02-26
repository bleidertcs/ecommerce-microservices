import { Controller, Get, Post, Body, Param, NotFoundException, Headers, Patch, BadRequestException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AuthUser } from '../../common/decorators/auth-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  async create(
    @AuthUser() user: any,
    @Body() createOrderDto: CreateOrderDto
  ) {
    if (!user || !user.id) throw new UnauthorizedException('User identity not found');
    return this.ordersService.createOrder(user.id, createOrderDto.items);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  async findMyOrders(@AuthUser() user: any) {
    if (!user || !user.id) throw new UnauthorizedException('User identity not found');
    return this.ordersService.findByUser(user.id);
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
