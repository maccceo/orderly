<?php

namespace App\Http\Controllers;

use App\Enums\Order\OrderStatusType;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{

    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $orders = Order::with('payment', 'orderItems', 'client')->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = Order::create([
            "client_id" => $request["client_id"],
            "status" => $request["status"],
            "total" => $request["total"]
        ]);
        // create OrderItems
        $order->orderItems()->saveMany(
            collect($request['order_items'])->map(function ($item) {
                return new OrderItem($item);
            })
        );
        // create Payment
        $payment = new Payment([
            'status' => OrderStatusType::getPaymentStatus(OrderStatusType::from($request["status"])),
            'amount' => $request["total"],
            'method' => $this->paymentService->getRandomPaymentMethod(),
            'paid_at' => now()
        ]);
        $order->payment()->save($payment);
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

        if (!empty($request['order_items'])) {
            // delete previous OrderItems
            OrderItem::where('order_id', $order->id)->delete();
            // create new updated ones
            $order->orderItems()->saveMany(
                collect($request['order_items'])->map(function ($item) {
                    return new OrderItem($item);
                })
            );
        }
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
