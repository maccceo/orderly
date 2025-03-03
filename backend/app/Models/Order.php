<?php

namespace App\Models;

use App\Enums\Order\OrderStatusType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'status', 'total'];

    protected $casts = [
        'status' => OrderStatusType::class,
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items')
            ->using(OrderItem::class)
            ->withTimestamps();
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
