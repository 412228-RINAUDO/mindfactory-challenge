import type { AuthResponse } from '@/interfaces/Auth'
import { localStorageService } from '@/services/localStorageService'

const API_URL = "/api/v1"

interface ApiError {
  statusCode: number
  errorCode: string
  message: string | string[]
  validationErrors?: string[]
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorageService.get<AuthResponse>('user')?.access_token;
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      statusCode: response.status,
      errorCode: 'UNKNOWN_ERROR',
      message: response.statusText,
    }))

    throw errorData
  }

  return response.json()
}
