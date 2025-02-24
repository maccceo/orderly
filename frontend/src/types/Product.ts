export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

export interface CreateProductPayload {
  name: string
  description: string
  price: number
  stock: number
}

export interface UpdateProductPayload {
  id: number
  name?: string
  description?: string
  price?: number
  stock?: number
}
