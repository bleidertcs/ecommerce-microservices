import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationsService } from '../modules/notifications/notifications.service';

interface NotificationRequest {
  userId: string;
  type: string;
  message: string;
  email: string;
}

interface NotificationResponse {
  success: boolean;
  message: string;
}

@Controller()
export class NotificationsGrpcController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @GrpcMethod('NotificationsService', 'SendNotification')
  async sendNotification(data: NotificationRequest): Promise<NotificationResponse> {
    try {
      if (data.type === 'WELCOME') {
          await this.notificationsService.sendWelcomeEmail({
              email: data.email,
              firstName: data.userId, // Fallback if firstName not provided
              lastName: ''
          });
      } else if (data.type === 'ORDER_CONFIRMATION') {
          await this.notificationsService.sendOrderConfirmation({
              orderId: data.message,
              total: 0,
              items: []
          });
      } else {
          this.notificationsService['logger'].log(`Generic notification for ${data.userId}: ${data.message}`);
      }

      return {
        success: true,
        message: 'Notification processed successfully via gRPC',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to process notification: ${error.message}`,
      };
    }
  }
}
