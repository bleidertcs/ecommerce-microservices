import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    async sendWelcomeEmail(userData: any) {
        const { email, firstName, lastName } = userData;

        // Simulate realistic processing delay
        await this.delay(1500);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`📧 [EMAIL SENT] | Welcome to Antigravity Shop!`);
        this.logger.log(`Recipient: ${firstName} ${lastName} <${email}>`);
        this.logger.log(`Content: Your account has been successfully created. Happy shopping!`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendOrderConfirmation(orderData: any) {
        const orderId = orderData.orderId || orderData.id;
        const itemsCount = orderData.items?.length || 0;
        const total = orderData.total || 0;

        await this.delay(2000);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`📦 [NOTIFICATION SENT] | Order Confirmation #${orderId}`);
        this.logger.log(`Items: ${itemsCount} products | Total: $${total.toFixed(2)}`);
        this.logger.log(`Status: PENDING PAYMENT`);
        this.logger.log(`----------------------------------------------------------`);
    }

    async sendPaymentConfirmation(paymentData: any) {
        const orderId = paymentData.orderId || paymentData.id;

        await this.delay(1000);

        this.logger.log(`----------------------------------------------------------`);
        this.logger.log(`💰 [PAYMENT RECEIVED] | Payment Confirmed for Order #${orderId}`);
        this.logger.log(`Status: PREPARING FOR SHIPMENT`);
        this.logger.log(`Confirmation: Thank you for your purchase!`);
        this.logger.log(`----------------------------------------------------------`);
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
