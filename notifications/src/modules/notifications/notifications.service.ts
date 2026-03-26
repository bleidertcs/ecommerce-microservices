import { Injectable, Logger } from '@nestjs/common';
import { NotificationType, NotificationEvent } from '@/common/enums/notification-type.enum';
import {
    UserCreatedPayloadDto,
    OrderCreatedPayloadDto,
    OrderPaidPayloadDto,
} from '@/modules/notifications/dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    async sendWelcomeEmail(userData: UserCreatedPayloadDto) {
        const { email, firstName, lastName } = userData;

        await this.delay(1500);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`[${NotificationType.EMAIL}] [${NotificationEvent.USER_CREATED}]`);
        this.logger.log(`📧 [EMAIL SENT] | Welcome to Antigravity Shop!`);
        this.logger.log(`Recipient: ${firstName} ${lastName} <${email}>`);
        this.logger.log(`Content: Your account has been successfully created. Happy shopping!`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendOrderConfirmation(orderData: OrderCreatedPayloadDto) {
        const { orderId, userName, userEmail, total, items } = orderData;
        const itemsCount = items?.length || 0;
        const totalAmount = typeof total === 'string' ? parseFloat(total) : total;

        await this.delay(2000);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`[${NotificationType.EMAIL}] [${NotificationEvent.ORDER_PLACED}]`);
        this.logger.log(`📦 [NOTIFICATION SENT] | Order Confirmation #${orderId}`);
        this.logger.log(`Customer: ${userName || 'N/A'} <${userEmail || 'N/A'}>`);
        this.logger.log(`Items: ${itemsCount} products | Total: $${totalAmount?.toFixed(2) || '0.00'}`);
        this.logger.log(`Status: PENDING PAYMENT`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendPaymentConfirmation(paymentData: OrderPaidPayloadDto) {
        const { orderId, userName, userEmail, total } = paymentData;
        const totalAmount = typeof total === 'string' ? parseFloat(total) : total;

        await this.delay(1000);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`[${NotificationType.EMAIL}] [${NotificationEvent.ORDER_PAID}]`);
        this.logger.log(`💰 [PAYMENT RECEIVED] | Payment Confirmed for Order #${orderId}`);
        this.logger.log(`Customer: ${userName || 'N/A'} <${userEmail || 'N/A'}>`);
        this.logger.log(`Amount: $${totalAmount?.toFixed(2) || '0.00'}`);
        this.logger.log(`Status: PREPARING FOR SHIPMENT`);
        this.logger.log(`Confirmation: Thank you for your purchase!`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendOrderShipped(shippedData: any) {
        const { orderId, userName, userEmail, trackingNumber, carrier } = shippedData;

        await this.delay(1000);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`[${NotificationType.EMAIL}] [${NotificationEvent.ORDER_SHIPPED}]`);
        this.logger.log(`🚚 [ORDER SHIPPED] | Order #${orderId}`);
        this.logger.log(`Customer: ${userName || 'N/A'} <${userEmail || 'N/A'}>`);
        this.logger.log(`Carrier: ${carrier || 'N/A'} | Tracking: ${trackingNumber || 'N/A'}`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendPaymentFailed(failedData: any) {
        const { orderId, userEmail, amount, reason } = failedData;
        const failedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

        await this.delay(500);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`[${NotificationType.EMAIL}] [${NotificationEvent.PAYMENT_FAILED}]`);
        this.logger.log(`❌ [PAYMENT FAILED] | Order #${orderId}`);
        this.logger.log(`Recipient: <${userEmail || 'N/A'}>`);
        this.logger.log(`Amount: $${failedAmount?.toFixed(2) || '0.00'}`);
        this.logger.log(`Reason: ${reason || 'Unknown'}`);
        this.logger.log(`----------------------------------------------------------`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
