<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// guest routes
Route::post('/login', [AuthController::class, 'login']);

// auth routes
$rolesResourceAbilities = [
    'index' => 'ability:user,admin',
    'show' => 'ability:user,admin',
    'store' => 'ability:admin',
    'update' => 'ability:admin',
    'destroy' => 'ability:admin',
];

Route::middleware('auth:sanctum')->group(function () use ($rolesResourceAbilities) {
    Route::post('/logout', [AuthController::class, 'logout']);

    // clients
    Route::get('clients', [ClientController::class, 'index'])->middleware('ability:user,admin');
    Route::get('clients/{order}', [ClientController::class, 'show'])->middleware('ability:user,admin');
    Route::post('clients', [ClientController::class, 'store'])->middleware('ability:admin');
    Route::put('clients/{order}', [ClientController::class, 'update'])->middleware('ability:admin');
    Route::delete('clients/{order}', [ClientController::class, 'destroy'])->middleware('ability:admin');
    // products
    Route::get('products', [ProductController::class, 'index'])->middleware('ability:user,admin');
    Route::get('products/{order}', [ProductController::class, 'show'])->middleware('ability:user,admin');
    Route::post('products', [ProductController::class, 'store'])->middleware('ability:admin');
    Route::put('products/{order}', [ProductController::class, 'update'])->middleware('ability:admin');
    Route::delete('products/{order}', [ProductController::class, 'destroy'])->middleware('ability:admin');
    // orders
    Route::get('orders', [OrderController::class, 'index'])->middleware('ability:user,admin');
    Route::get('orders/{order}', [OrderController::class, 'show'])->middleware('ability:user,admin');
    Route::post('orders', [OrderController::class, 'store'])->middleware('ability:admin');
    Route::put('orders/{order}', [OrderController::class, 'update'])->middleware('ability:admin');
    Route::delete('orders/{order}', [OrderController::class, 'destroy'])->middleware('ability:admin');
});
