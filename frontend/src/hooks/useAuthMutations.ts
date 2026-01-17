import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { localStorageService } from '@/services/localStorageService'
import { useAuth } from '@/contexts/AuthContext'
import type { AuthResponse, SignupData } from '@/interfaces/Auth'

export function useLogin() {
  const { setUser } = useAuth()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      localStorageService.set<AuthResponse>('user', data)
    
      setUser(data.user)
    },
  })
}

export function useSignup() {
  const { setUser } = useAuth()
  
  return useMutation({
    mutationFn: ({ name, email, password }: SignupData) =>
      authService.signup({ name, email, password }),
    onSuccess: (data) => {
      localStorageService.set('user', data)
      
      setUser(data.user)
    },
  })
}
