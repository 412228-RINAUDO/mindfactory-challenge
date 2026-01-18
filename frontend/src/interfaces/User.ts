export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
}
