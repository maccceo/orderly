<?php

namespace App\Enums\Payment;

enum PaymentStatusType: string
{
    case PENDING = 'pending';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
