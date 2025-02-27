import type { Payment } from './Payment'
import type { OrderItems } from './OrderItems'
import type { Client } from './Client'

export interface Order {
  id: number
  client_id: number
  client: Client
  status: OrderStatus
  total: number
  created_at: string
  updated_at: string
  payment: Payment
  order_items: OrderItems[]
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface CreateOrderPayload {
  client_id: number
  status: OrderStatus
  total: number
  order_items: CreateOrderItemsPayload[]
}

export interface CreateOrderItemsPayload {
  product_id: number
  quantity: number
  price: number
}

export interface UpdateOrderPayload {
  id: number
  client_id?: number
  status?: OrderStatus
  total?: number
  order_items?: UpdateOrderItemsPayload[]
}

export interface UpdateOrderItemsPayload {
  product_id?: number
  quantity?: number
  price?: number
}

export interface OrderForm {
  client_id: number | null
  status: OrderStatus | null
  items: OrderFormItems[]
  total: number
}

export interface OrderFormItems {
  product_id: number
  quantity: number
  price: number
  description: string
}
