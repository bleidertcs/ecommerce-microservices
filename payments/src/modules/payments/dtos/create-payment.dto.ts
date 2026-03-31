import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@/common/enums/payment-method.enum';
import { Currency } from '@/common/enums/payment-method.enum';

export class CreatePaymentDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 299.99 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    amount: number;

    @ApiProperty({ enum: Currency, example: Currency.USD })
    @IsEnum(Currency)
    @IsOptional()
    currency?: Currency;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: Record<string, any>;
}

export class OrderCreatedPayloadDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiPropertyOptional({ example: 'usr_12345' })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({ example: 299.99 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    total: number;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiPropertyOptional()
    @IsOptional()
    items?: unknown[];

    @ApiPropertyOptional()
    @IsOptional()
    shippingAddress?: unknown;
}
