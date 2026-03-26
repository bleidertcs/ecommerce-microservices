import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, NotificationEvent } from '@/common/enums/notification-type.enum';

export class NotificationResponseDto {
    @ApiProperty({ example: 'ntf_abc123' })
    id: string;

    @ApiProperty({ enum: NotificationType })
    type: NotificationType;

    @ApiProperty({ enum: NotificationEvent })
    event: NotificationEvent;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    recipient?: string;

    @ApiProperty({ example: 'Notification sent successfully' })
    message: string;

    @ApiPropertyOptional()
    metadata?: Record<string, any>;

    @ApiProperty({ example: new Date().toISOString() })
    createdAt: Date;
}

export class NotificationLogResponseDto {
    @ApiProperty({ example: 'ntf_abc123' })
    id: string;

    @ApiProperty({ enum: NotificationType })
    type: NotificationType;

    @ApiProperty({ enum: NotificationEvent })
    event: NotificationEvent;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    recipient?: string;

    @ApiProperty({ example: 'Welcome email sent' })
    message: string;

    @ApiPropertyOptional()
    metadata?: Record<string, any>;

    @ApiProperty({ example: new Date().toISOString() })
    createdAt: Date;
}
