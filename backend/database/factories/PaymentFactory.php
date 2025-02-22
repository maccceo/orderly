<?php

namespace Database\Factories;

use App\Enums\Payment\PaymentMethodType;
use App\Enums\Payment\PaymentStatusType;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 5000),
            'method' => $this->faker->randomElement(array_column(PaymentMethodType::cases(), 'value')),
            'status' => $this->faker->randomElement(array_column(PaymentStatusType::cases(), 'value')),
            'paid_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
