import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { localStorageService } from '@/services/localStorageService'
import { useAuth } from '@/contexts/AuthContext'
import { notificationService } from '@/services/notificationService'
import type { AuthResponse, SignupData } from '@/interfaces/Auth'

export function useLogin() {
  const { setUser } = useAuth()
  
  return useMutation<AuthResponse, unknown, { email: string; password: string }>({
    mutationFn: ({ email, password }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      localStorageService.set<AuthResponse>('user', data)
      setUser(data.user)
      notificationService.success('¡Bienvenido!', `Hola ${data.user.name}`)
    },
    onError: (error) => {
      notificationService.handleError(error)
    },
  })
}

export function useSignup() {
  const { setUser } = useAuth()
  
  return useMutation<AuthResponse, unknown, SignupData>({
    mutationFn: ({ name, email, password }) =>
      authService.signup({ name, email, password }),
    onSuccess: (data) => {
      localStorageService.set('user', data)
      setUser(data.user)
      notificationService.success('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente')
    },
    onError: (error) => {
      notificationService.handleError(error)
    },
  })
}
