import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UnauthorizedException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from '@/modules/payments/payments.service';
import { AuthUser } from '@/common/decorators/auth-user.decorator';
import { AllowedRoles } from '@/common/decorators/auth-roles.decorator';
import { AuthJwtAccessGuard } from '@/common/guards/jwt.access.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { IAuthUserPayload } from '@/common/interfaces/request.interface';
import { PaymentQueryDto } from '@/modules/payments/dtos/payment-query.dto';
import { OrderCreatedPayloadDto } from '@/modules/payments/dtos/create-payment.dto';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthJwtAccessGuard, RolesGuard)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @AllowedRoles(['ADMIN' as any])
  async findAll(@Query() query: PaymentQueryDto): Promise<any> {
    return this.paymentsService.findAll(query);
  }

  @Get('my-payments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user payments' })
  async findMyPayments(@AuthUser() user: IAuthUserPayload) {
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
  @ApiOperation({ summary: 'Handle order.created event - process payment' })
  async handleOrderCreated(@Payload() data: OrderCreatedPayloadDto) {
    this.logger.log(`[EVENT] order.created - Order: ${data.orderId}`);
    await this.paymentsService.processPayment(data);
  }
}
