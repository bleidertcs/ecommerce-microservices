import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '@/common/enums/payment-status.enum';

export class UpdatePaymentDto {
    @ApiPropertyOptional({ enum: PaymentStatus })
    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;

    @ApiPropertyOptional()
    @IsOptional()
    transactionId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: Record<string, any>;
}
