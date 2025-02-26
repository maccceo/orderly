<?php

namespace App\Services;

use App\Enums\Payment\PaymentMethodType;

class PaymentService
{
    public function getRandomPaymentMethod(): PaymentMethodType
    {
        $cases = PaymentMethodType::cases();
        return $cases[array_rand($cases)];
    }
}
