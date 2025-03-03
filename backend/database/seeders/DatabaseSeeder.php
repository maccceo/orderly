<?php

namespace Database\Seeders;

use App\Enums\Order\OrderStatusType;
use App\Enums\Payment\PaymentStatusType;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private Collection $clients;
    private Collection $products;
    private Collection $orders;
    private Collection $orderItems;
    private Collection $payments;

    const CLIENTS_TO_CREATE = 20;
    const PRODUCTS_TO_CREATE = 10;
    const MAX_ORDERS_PER_CLIENT = 6;  // max amount of orders created per client
    const MAX_PRODUCTS_ORDERED = 4;   // max amount of products purchased in a single order (needs to be < PRODUCTS_TO_CREATE)
    const MAX_SINGLE_TYPE_PRODUCT_ORDERED = 5;  // max amount of single product purchased in a single order

    public function __construct()
    {
        $this->clients = new Collection();
        $this->products = new Collection();
        $this->orders = new Collection();
        $this->orderItems = new Collection();
        $this->payments = new Collection();
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->seedUsers();
        $this->seedClients();
        $this->seedProducts();
        $this->seedOrders();
        $this->seedOrderItems();
        $this->seedPayments();
    }
    private function seedUsers(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@orderly.com',
            'email_verified_at' => now(),
            'role' => 'admin',
            'password' => Hash::make('admin')
        ]);
        User::factory()->create([
            'name' => 'user',
            'email' => 'user@orderly.com',
            'email_verified_at' => now(),
            'role' => 'user',
            'password' => Hash::make('user')
        ]);
    }
    private function seedClients(): void
    {
        $this->clients = Client::factory()->count(self::CLIENTS_TO_CREATE)->create();
    }

    private function seedProducts(): void
    {
        $this->products = Product::factory()->count(self::PRODUCTS_TO_CREATE)->create();
    }

    private function seedOrders(): void
    {
        $this->clients->each(function ($client) {
            $numOrder = rand(0, self::MAX_ORDERS_PER_CLIENT);
            if ($numOrder === 0) {
                return;
            }
            $this->orders = $this->orders->merge(
                Order::factory()
                    ->count($numOrder)
                    ->create([
                        'client_id' => $client->id
                    ])
            );
        });
    }

    private function seedOrderItems(): void
    {
        $this->orders->each(function ($order) {
            // get a random amount of products
            $productsOrdered = $this->products->random(rand(1, self::MAX_PRODUCTS_ORDERED));
            $subtotal = 0;

            $productsOrdered->each(function ($product) use ($order, &$subtotal) {
                $purchased = rand(1, self::MAX_SINGLE_TYPE_PRODUCT_ORDERED);
                $this->orderItems = $this->orderItems->merge(
                    OrderItem::factory()
                        ->count(1)
                        ->create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'quantity' => $purchased,
                            'price' => $product->price * $purchased
                        ])
                );
                $subtotal += $product->price * $purchased;
            });
            $order->update(['total' => $subtotal]);
        });
    }

    private function seedPayments(): void
    {
        $this->orders->each(function ($order) {
            $this->payments = $this->payments->merge(
                Payment::factory()
                    ->count(1)
                    ->create([
                        'order_id' => $order->id,
                        'status' => OrderStatusType::getPaymentStatus($order->status),
                        'amount' => $order->total
                    ])
            );
        });
    }
}
