export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentEvent {
    ORDER_CREATED = 'order.created',
    PAYMENT_PROCESSED = 'payment.processed',
    PAYMENT_FAILED = 'payment.failed',
    ORDER_PAID = 'order.paid',
}
