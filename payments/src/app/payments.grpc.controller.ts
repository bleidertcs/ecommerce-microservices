import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentsService } from '@/modules/payments/payments.service';
import { PaymentMethod } from '@/common/enums/payment-method.enum';

interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
}

@Controller()
export class PaymentsGrpcController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @GrpcMethod('PaymentsService', 'ProcessPayment')
  async processPayment(data: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Use existing service logic to process payment
      await this.paymentsService.processPayment({
        orderId: data.orderId,
        total: data.amount,
        shippingAddress: {},
        paymentMethod: data.paymentMethod as PaymentMethod,
      });

      return {
        success: true,
        transactionId: `GRPC-${Date.now()}`,
        message: 'Payment processed successfully via gRPC',
      };
    } catch (error: any) {
      return {
        success: false,
        transactionId: '',
        message: `gRPC Payment failed: ${error.message}`,
      };
    }
  }
}
