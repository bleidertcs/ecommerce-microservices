import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);

    constructor(private readonly notificationsService: NotificationsService) {}

    @EventPattern('user.created')
    async handleUserCreated(@Payload() data: any) {

        this.logger.log(`Received user.created event for user: ${data.email}`);
        await this.notificationsService.sendWelcomeEmail(data);

        // Manual acknowledgment if needed, but Nest handles it by default if noManualAck is false
        // channel.ack(originalMsg);
    }

    @EventPattern('order.created')
    async handleOrderCreated(@Payload() data: any) {
        this.logger.log(`Received order.created event for Order #${data.orderId || data.id}`);
        await this.notificationsService.sendOrderConfirmation(data);
    }

    @EventPattern('order.paid')
    async handleOrderPaid(@Payload() data: any) {
        this.logger.log(`Received order.paid event for Order #${data.orderId || data.id}`);
        await this.notificationsService.sendPaymentConfirmation(data);
    }
}
