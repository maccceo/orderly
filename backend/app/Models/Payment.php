<?php

namespace App\Models;

use App\Enums\Payment\PaymentMethodType;
use App\Enums\Payment\PaymentStatusType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['amount', 'method', 'status', 'paid_at'];
    
    protected $casts = [
        'method' => PaymentMethodType::class,
        'status' => PaymentStatusType::class,
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
