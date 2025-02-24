export interface Payment {
  id: number
  order_id: number
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  paid_at: string
  created_at: string
  updated_at: string
}

export type PaymentStatus = 'pending' | 'completed' | 'failed'
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer'
