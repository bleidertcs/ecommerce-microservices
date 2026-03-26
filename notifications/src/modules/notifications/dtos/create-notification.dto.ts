import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { NotificationType, NotificationEvent } from '@/common/enums/notification-type.enum';

export class UserCreatedPayloadDto {
    @ApiProperty({ example: 'usr_12345' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
}

export class OrderCreatedPayloadDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'usr_12345' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({ example: 299.99 })
    @IsString()
    @IsNotEmpty()
    total: string | number;

    @ApiPropertyOptional({ example: ['Product A', 'Product B'] })
    @IsOptional()
    items?: string[];
}

export class OrderPaidPayloadDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'usr_12345' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({ example: 299.99 })
    @IsString()
    @IsNotEmpty()
    total: string | number;

    @ApiPropertyOptional({ example: 'PAID' })
    @IsString()
    @IsOptional()
    paymentStatus?: string;
}

export class OrderShippedPayloadDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'usr_12345' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    userName?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    userEmail?: string;

    @ApiPropertyOptional({ example: 'TRACK123456' })
    @IsString()
    @IsOptional()
    trackingNumber?: string;

    @ApiPropertyOptional({ example: 'FedEx' })
    @IsString()
    @IsOptional()
    carrier?: string;
}

export class PaymentFailedPayloadDto {
    @ApiProperty({ example: 'ord_67890' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'usr_12345' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({ example: 299.99 })
    @IsString()
    @IsNotEmpty()
    amount: string | number;

    @ApiPropertyOptional({ example: 'Card declined' })
    @IsString()
    @IsOptional()
    reason?: string;
}

export class NotificationLogDto {
    @ApiProperty({ example: 'ntf_abc123' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ enum: NotificationType })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({ enum: NotificationEvent })
    @IsEnum(NotificationEvent)
    event: NotificationEvent;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsString()
    @IsOptional()
    recipient?: string;

    @ApiProperty({ example: 'Notification sent successfully' })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: Record<string, any>;

    @ApiProperty({ example: new Date().toISOString() })
    @IsString()
    @IsNotEmpty()
    createdAt: string;
}
