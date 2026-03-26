import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@/common/enums/payment-status.enum';
import { PaymentMethod, Currency } from '@/common/enums/payment-method.enum';

export class PaymentResponseDto {
    @ApiProperty({ example: 'pmt_abc123' })
    id: string;

    @ApiProperty({ example: 'ord_67890' })
    orderId: string;

    @ApiPropertyOptional({ example: 'usr_12345' })
    userId?: string;

    @ApiProperty({ example: 299.99 })
    amount: number;

    @ApiProperty({ enum: Currency })
    currency: Currency;

    @ApiProperty({ enum: PaymentStatus })
    status: PaymentStatus;

    @ApiProperty({ enum: PaymentMethod })
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({ example: 'txn_sim_123456789' })
    transactionId?: string;

    @ApiPropertyOptional()
    metadata?: Record<string, any>;

    @ApiProperty({ example: new Date().toISOString() })
    createdAt: Date;

    @ApiPropertyOptional({ example: new Date().toISOString() })
    updatedAt?: Date;
}

export class PaymentListResponseDto {
    @ApiProperty({ type: [PaymentResponseDto] })
    items: PaymentResponseDto[];

    @ApiProperty({
        example: {
            page: 1,
            limit: 10,
            total: 100,
            totalPages: 10,
            hasNextPage: true,
            hasPreviousPage: false,
        },
    })
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
