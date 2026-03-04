import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import type { OrderCreatedPayload } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get('my-payments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user payments' })
  async findMyPayments(@AuthUser() user: { id?: string }) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.paymentsService.findByUser(user.id);
  }

  @Get('order/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by order ID' })
  async findByOrderId(@Param('orderId') orderId: string) {
    const payment = await this.paymentsService.findByOrderId(orderId);
    if (!payment) throw new NotFoundException('Payment not found for this order');
    return payment;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: OrderCreatedPayload) {
    this.logger.log(`Received order.created event for Order ID: ${data.orderId}`);
    await this.paymentsService.processPayment(data);
  }
}
