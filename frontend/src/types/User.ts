export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'user'
