import { apiClient } from '@/api/client'
import { HttpMethod } from '@/enums/httpMethods'
import type { User } from '@/interfaces/User'

export const userService = {
  getById: (id: string) => apiClient<User>(`/users/${id}`),
  
  update: (id: string, data: Partial<User>) =>
    apiClient<User>(`/users/${id}`, {
      method: HttpMethod.PUT,
      body: JSON.stringify(data),
    }),
}
