import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '@/common/enums/payment-status.enum';
import { PaymentMethod } from '@/common/enums/payment-method.enum';

export class PaymentQueryDto {
    @ApiProperty({ example: 1, minimum: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'createdAt' })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsString()
    @IsOptional()
    sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional({ example: 'usr_12345' })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ enum: PaymentStatus })
    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;

    @ApiPropertyOptional({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional({ example: 'ord_67890' })
    @IsString()
    @IsOptional()
    orderId?: string;
}
