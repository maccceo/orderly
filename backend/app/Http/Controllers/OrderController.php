<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        // $orders = Order::paginate(20);
        $orders = Order::with('payment', 'orderItems')->paginate(20);
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = Order::create($request->validated());
        return response()->json($order, 201);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Order $order): JsonResponse
    {
        // return response()->json($order);
        return response()->json($order->load('payment', 'orderItems'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $order->update($request->validated());
        return response()->json([
            'data' => $order,
            'message' => 'Order edited successfully'
        ]);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
