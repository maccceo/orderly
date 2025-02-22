<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['amount', 'method', 'status', 'paid_at'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
