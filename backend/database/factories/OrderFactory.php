<?php

namespace Database\Factories;

use App\Enums\Order\OrderStatusType;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'status' => $this->faker->randomElement(array_column(OrderStatusType::cases(), 'value')),
            'total' => $this->faker->randomFloat(2, 100, 5000),
        ];
    }
}
