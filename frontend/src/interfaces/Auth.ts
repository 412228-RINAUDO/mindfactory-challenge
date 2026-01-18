import type { User } from './User'

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  access_token: string
}
