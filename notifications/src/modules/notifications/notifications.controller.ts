import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import {
    UserCreatedPayloadDto,
    OrderCreatedPayloadDto,
    OrderPaidPayloadDto,
} from '@/modules/notifications/dtos/create-notification.dto';

@ApiTags('Notifications')
@Controller()
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);

    constructor(private readonly notificationsService: NotificationsService) {}

    @EventPattern('user.created')
    @ApiOperation({ summary: 'Handle user.created event - send welcome email' })
    async handleUserCreated(@Payload() data: UserCreatedPayloadDto) {
        this.logger.log(`[EVENT] user.created - Email: ${data.email}`);
        await this.notificationsService.sendWelcomeEmail(data);
    }

    @EventPattern('order.created')
    @ApiOperation({ summary: 'Handle order.created event - send order confirmation' })
    async handleOrderCreated(@Payload() data: OrderCreatedPayloadDto) {
        this.logger.log(`[EVENT] order.created - Order: ${data.orderId}`);
        await this.notificationsService.sendOrderConfirmation(data);
    }

    @EventPattern('order.paid')
    @ApiOperation({ summary: 'Handle order.paid event - send payment confirmation' })
    async handleOrderPaid(@Payload() data: OrderPaidPayloadDto) {
        this.logger.log(`[EVENT] order.paid - Order: ${data.orderId}`);
        await this.notificationsService.sendPaymentConfirmation(data);
    }

    @EventPattern('order.shipped')
    @ApiOperation({ summary: 'Handle order.shipped event - send shipping notification' })
    async handleOrderShipped(@Payload() data: any) {
        this.logger.log(`[EVENT] order.shipped - Order: ${data.orderId}`);
        await this.notificationsService.sendOrderShipped(data);
    }

    @EventPattern('payment.failed')
    @ApiOperation({ summary: 'Handle payment.failed event - send failure notification' })
    async handlePaymentFailed(@Payload() data: any) {
        this.logger.log(`[EVENT] payment.failed - Order: ${data.orderId}`);
        await this.notificationsService.sendPaymentFailed(data);
    }
}
