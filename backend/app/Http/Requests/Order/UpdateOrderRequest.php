<?php

namespace App\Http\Requests\Order;

use App\Enums\Order\OrderStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
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
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'status' => ['sometimes', Rule::enum(OrderStatusType::class)],
            'total' => ['sometimes', 'numeric', 'min:0'],
            'order_items' => ['sometimes', 'array'],
            'order_items.*.product_id' => ['required_with:order_items', 'integer', 'exists:products,id'],
            'order_items.*.quantity' => ['required_with:order_items', 'integer', 'min:1'],
            'order_items.*.price' => ['required_with:order_items', 'numeric', 'min:0'],
        ];
    }
}
