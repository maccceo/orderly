import type { Payment } from './Payment'
import type { OrderItems } from './OrderItems'

export interface Order {
  id: number
  client_id: number
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
}

export interface UpdateOrderPayload {
  id: number
  client_id?: number
  status?: OrderStatus
  total?: number
}
