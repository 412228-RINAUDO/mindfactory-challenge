import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { SignUpPage } from './SignUpPage'

// Mock useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useSignup hook
const mockMutate = vi.fn()
const mockUseSignup = vi.fn()

vi.mock('@/hooks/useAuthMutations', () => ({
  useSignup: () => mockUseSignup(),
}))

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSignup.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  describe('Rendering', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )
    })

    it('should render name, email and password inputs', () => {
      screen.getByTestId('signup-name-input')
      screen.getByTestId('signup-email-input')
      screen.getByTestId('signup-password-input')
    })

    it('should render submit button', () => {
      screen.getByRole('button', { name: 'Create account' })
    })

    it('should render link to login page', () => {
      const loginLink = screen.getByRole('link', { name: 'Sign in' })
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })

  describe('Form validation', () => {
    it('submit button should be disabled when isPending is true', () => {
      mockUseSignup.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      })

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Creating account...' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form submission', () => {
    it('should call signup with name, email and password when form is submitted', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const nameInput = screen.getByTestId('signup-name-input')
      const emailInput = screen.getByTestId('signup-email-input')
      const passwordInput = screen.getByTestId('signup-password-input')

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Create account' })
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith(
        { name: 'John Doe', email: 'test@example.com', password: 'password123' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('should navigate to home page on successful signup', async () => {
      const user = userEvent.setup()

      mockMutate.mockImplementation((_data, options) => {
        options.onSuccess()
      })

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const nameInput = screen.getByTestId('signup-name-input')
      const emailInput = screen.getByTestId('signup-email-input')
      const passwordInput = screen.getByTestId('signup-password-input')

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: 'Create account' })
      await user.click(submitButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('User interactions', () => {
    it('should update name when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const nameInput = screen.getByTestId('signup-name-input') as HTMLInputElement

      await user.type(nameInput, 'John Doe')

      expect(nameInput.value).toBe('John Doe')
    })

    it('should update email when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const emailInput = screen.getByTestId('signup-email-input') as HTMLInputElement

      await user.type(emailInput, 'test@example.com')

      expect(emailInput.value).toBe('test@example.com')
    })

    it('should update password when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )

      const passwordInput = screen.getByTestId('signup-password-input') as HTMLInputElement

      await user.type(passwordInput, 'mypassword')

      expect(passwordInput.value).toBe('mypassword')
    })
  })
})
