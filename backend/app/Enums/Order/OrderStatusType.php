<?php

namespace App\Enums\Order;

use App\Enums\Payment\PaymentStatusType;

enum OrderStatusType: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    public static function getPaymentStatus(self $orderStatus): PaymentStatusType
    {
        return match ($orderStatus) {
            self::PENDING => PaymentStatusType::PENDING,
            self::PAID => PaymentStatusType::COMPLETED,
            self::SHIPPED => PaymentStatusType::COMPLETED,
            self::DELIVERED => PaymentStatusType::COMPLETED,
            self::CANCELLED => PaymentStatusType::FAILED,
        };
    }
}
