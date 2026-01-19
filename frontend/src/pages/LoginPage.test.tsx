import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockMutate = vi.fn()
const mockUseLogin = vi.fn()

vi.mock('@/hooks/useAuthMutations', () => ({
  useLogin: () => mockUseLogin(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  describe('Rendering', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )
    })

    it('should render email and password inputs', () => {
      screen.getByTestId('login-email-input')
      screen.getByTestId('login-password-input')
    })

    it('should render submit button', () => {
      screen.getByRole('button', { name: 'Iniciar sesión' })
    })

    it('should render link to sign up page', () => {
      const signupLink = screen.getByRole('link', { name: 'Regístrate' })
      expect(signupLink).toHaveAttribute('href', '/register')
    })
  })

  describe('Form validation', () => {
    it('submit button should be disabled when isPending is true', () => {
      mockUseLogin.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      })

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Iniciando sesión...' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form submission', () => {
    it('should call login with email and password when form is submitted', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      const emailInput = screen.getByTestId('login-email-input')
      const passwordInput = screen.getByTestId('login-password-input')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' })
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('should navigate to home page on successful login', async () => {
      const user = userEvent.setup()

      mockMutate.mockImplementation((_data, options) => {
        options.onSuccess()
      })

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      const emailInput = screen.getByTestId('login-email-input')
      const passwordInput = screen.getByTestId('login-password-input')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' })
      await user.click(submitButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('User interactions', () => {
    it('should update email when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      const emailInput = screen.getByTestId('login-email-input') as HTMLInputElement

      await user.type(emailInput, 'test@example.com')

      expect(emailInput.value).toBe('test@example.com')
    })

    it('should update password when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )

      const passwordInput = screen.getByTestId('login-password-input') as HTMLInputElement

      await user.type(passwordInput, 'mypassword')

      expect(passwordInput.value).toBe('mypassword')
    })
  })
})
