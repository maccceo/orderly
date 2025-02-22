<?php

namespace App\Enums\Payment;

enum PaymentMethodType: string
{
    case CREDIT_CARD = 'credit_card';
    case PAYPAL = 'paypal';
    case BANK_TRANSFER = 'bank_transfer';
}