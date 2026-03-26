export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    IN_APP = 'IN_APP',
}

export enum NotificationEvent {
    USER_CREATED = 'user.created',
    ORDER_PLACED = 'order.created',
    ORDER_PAID = 'order.paid',
    ORDER_SHIPPED = 'order.shipped',
    ORDER_CANCELLED = 'order.cancelled',
    PAYMENT_FAILED = 'payment.failed',
}
