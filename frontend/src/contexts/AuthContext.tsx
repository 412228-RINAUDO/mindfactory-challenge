import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/interfaces/User'
import { localStorageService } from '@/services/localStorageService'
import type { AuthResponse } from '@/interfaces/Auth'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void,
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorageService.get<AuthResponse>('user')?.user;
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const logout = () => {
    setUser(null)
    localStorageService.remove('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
