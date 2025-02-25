<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'status' => ['required', Rule::enum(OrderStatusType::class)],
            'total' => ['required', 'numeric', 'min:0'],
            'order_items' => ['required', 'array', 'min:1'],
            'order_items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'order_items.*.quantity' => ['required', 'integer', 'min:1'],
            'order_items.*.price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
