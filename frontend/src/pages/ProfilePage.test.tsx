import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'

const mockUseParams = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockUseParams(),
  }
})

const mockUseAuth = vi.fn()

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

const mockUseUser = vi.fn()

vi.mock('@/hooks/useUser', () => ({
  useUser: (id: string | undefined) => mockUseUser(id),
}))

describe('ProfilePage', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Test bio',
    created_at: '2024-01-15T10:00:00Z',
  }

  const mockCurrentUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Test bio',
    created_at: '2024-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ id: '123' })
    mockUseAuth.mockReturnValue({
      user: null,
      setUser: vi.fn(),
      logout: vi.fn(),
    })
  })

  describe('Loading state', () => {
    it('should show loading message while fetching user data', () => {
      mockUseUser.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByText('Cargando perfil...')
    })
  })

  describe('Error state', () => {
    it('should show error message when user fails to load', () => {
      mockUseUser.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch'),
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByText('Error al cargar el perfil')
    })
  })

  describe('Successful load', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
      })
    })

    it('should render user name', () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByRole('heading', { name: mockUser.name })
    })

    it('should render user email', () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByText(mockUser.email)
    })

    it('should render joined date', () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByText(/Se unió el 15 ene 2024, \d{2}:\d{2}/)
    })

    it('should render "All posts" back link', () => {
      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      const backLink = screen.getByRole('link', { name: 'Todos los posts' })
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Owner permissions', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
      })
    })

    it('should show "Edit profile" button when current user is the profile owner', () => {
      mockUseAuth.mockReturnValue({
        user: mockCurrentUser,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      screen.getByRole('link', { name: 'Editar perfil' })
    })

    it('should NOT show "Edit profile" button when current user is not the owner', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockCurrentUser, id: '999' },
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      const editButton = screen.queryByRole('link', { name: 'Editar perfil' })
      expect(editButton).not.toBeInTheDocument()
    })

    it('should NOT show "Edit profile" button when no user is logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      const editButton = screen.queryByRole('link', { name: 'Editar perfil' })
      expect(editButton).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('"Edit profile" button should link to /profile/:id/edit', () => {
      mockUseUser.mockReturnValue({
        data: mockUser,
        isLoading: false,
        error: null,
      })

      mockUseAuth.mockReturnValue({
        user: mockCurrentUser,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <ProfilePage />
        </BrowserRouter>
      )

      const editButton = screen.getByRole('link', { name: 'Editar perfil' })
      expect(editButton).toHaveAttribute('href', `/profile/${mockUser.id}/edit`)
    })
  })
})
