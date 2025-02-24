export interface Client {
  id: number
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

export interface CreateClientPayload {
  name: string
  email: string
  phone: string
}

export interface UpdateClientPayload {
  id: string
  name?: string
  email?: string
  phone?: string
}
