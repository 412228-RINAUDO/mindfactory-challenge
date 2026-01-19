import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ProfileEditPage } from './ProfileEditPage'

// Mock useNavigate hook
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useAuth hook
const mockUseAuth = vi.fn()

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

// Mock useUser and useUpdateUser hooks
const mockUseUser = vi.fn()
const mockUseUpdateUser = vi.fn()

vi.mock('@/hooks/useUser', () => ({
  useUser: (id: string | undefined) => mockUseUser(id),
  useUpdateUser: (id: string) => mockUseUpdateUser(id),
}))

describe('ProfileEditPage', () => {
  const mockCurrentUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Test bio',
    created_at: '2024-01-01',
  }

  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: mockCurrentUser,
      setUser: vi.fn(),
      logout: vi.fn(),
    })
    mockUseUpdateUser.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  describe('Loading state', () => {
    it('should show loading message while fetching user data', () => {
      mockUseUser.mockReturnValue({
        data: null,
        isLoading: true,
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )

      screen.getByText('Loading profile...')
    })
  })

  describe('Rendering', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: mockCurrentUser,
        isLoading: false,
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )
    })

    it('should render form with name and email inputs', () => {
      screen.getByTestId('profile-name-input')
      screen.getByTestId('profile-email-input')
    })

    it('should render "Save changes" button', () => {
      screen.getByRole('button', { name: 'Save changes' })
    })

    it('should render "Cancel" button', () => {
      screen.getByRole('button', { name: 'Cancel' })
    })

    it('should render "Back to profile" link', () => {
      const backLink = screen.getByRole('link', { name: 'Back to profile' })
      expect(backLink).toHaveAttribute('href', `/profile/${mockCurrentUser.id}`)
    })
  })

  describe('Initial values', () => {
    it('should populate form with user data when loaded', async () => {
      mockUseUser.mockReturnValue({
        data: mockCurrentUser,
        isLoading: false,
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )

      await waitFor(() => {
        const nameInput = screen.getByTestId('profile-name-input') as HTMLInputElement
        const emailInput = screen.getByTestId('profile-email-input') as HTMLInputElement

        expect(nameInput.value).toBe(mockCurrentUser.name)
        expect(emailInput.value).toBe(mockCurrentUser.email)
      })
    })
  })

  describe('Form submission', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: mockCurrentUser,
        isLoading: false,
      })
    })

    it('should call updateUser with correct data when form is submitted', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByTestId('profile-name-input')).toBeInTheDocument()
      })

      const nameInput = screen.getByTestId('profile-name-input')
      const emailInput = screen.getByTestId('profile-email-input')

      await user.clear(nameInput)
      await user.clear(emailInput)
      await user.type(nameInput, 'Jane Doe')
      await user.type(emailInput, 'jane@example.com')

      const submitButton = screen.getByRole('button', { name: 'Save changes' })
      await user.click(submitButton)

      expect(mockMutate).toHaveBeenCalledTimes(1)
      expect(mockMutate).toHaveBeenCalledWith(
        { name: 'Jane Doe', email: 'jane@example.com' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        })
      )
    })

    it('should navigate to profile page on successful update', async () => {
      const user = userEvent.setup()

      mockMutate.mockImplementation((_data, options) => {
        options.onSuccess()
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.getByTestId('profile-name-input')).toBeInTheDocument()
      })

      const nameInput = screen.getByTestId('profile-name-input')
      const emailInput = screen.getByTestId('profile-email-input')

      await user.clear(nameInput)
      await user.clear(emailInput)
      await user.type(nameInput, 'Jane Doe')
      await user.type(emailInput, 'jane@example.com')

      const submitButton = screen.getByRole('button', { name: 'Save changes' })
      await user.click(submitButton)

      expect(mockNavigate).toHaveBeenCalledWith(`/profile/${mockCurrentUser.id}`)
    })
  })

  describe('User interactions', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: mockCurrentUser,
        isLoading: false,
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )
    })

    it('should update name when user types', async () => {
      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByTestId('profile-name-input')).toBeInTheDocument()
      })

      const nameInput = screen.getByTestId('profile-name-input') as HTMLInputElement

      await user.clear(nameInput)
      await user.type(nameInput, 'New Name')

      expect(nameInput.value).toBe('New Name')
    })

    it('should update email when user types', async () => {
      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByTestId('profile-email-input')).toBeInTheDocument()
      })

      const emailInput = screen.getByTestId('profile-email-input') as HTMLInputElement

      await user.clear(emailInput)
      await user.type(emailInput, 'newemail@example.com')

      expect(emailInput.value).toBe('newemail@example.com')
    })
  })

  describe('Button states', () => {
    it('submit button should be disabled when isPending is true', () => {
      mockUseUser.mockReturnValue({
        data: mockCurrentUser,
        isLoading: false,
      })

      mockUseUpdateUser.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      })

      render(
        <BrowserRouter>
          <ProfileEditPage />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Saving...' })
      expect(submitButton).toBeDisabled()
    })
  })
})
