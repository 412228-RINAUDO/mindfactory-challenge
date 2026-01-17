import type { AuthResponse } from '@/interfaces/Auth'
import { localStorageService } from '@/services/localStorageService'

const API_URL = import.meta.env.VITE_API_URL

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorageService.get<AuthResponse>('user')?.token;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
