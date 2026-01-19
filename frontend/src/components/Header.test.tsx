import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Header } from './Header'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: vi.fn(),
  }
})

import { useAuth } from '@/contexts/AuthContext'

const mockUseAuth = vi.mocked(useAuth)

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render "Writespace" link that redirects to "/"', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      setUser: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )

    const writespaceLink = screen.getByRole('link', { name: 'Writespace' })
    expect(writespaceLink).toHaveAttribute('href', '/')
  })

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
    })

    it('should render "Log in" and "Sign up" buttons', () => {
      screen.getByRole('link', { name: 'Iniciar sesión' })
      screen.getByRole('link', { name: 'Registrarse' })
    })

    it('"Log in" button should redirect to /login', () => {
      const loginButton = screen.getByRole('link', { name: 'Iniciar sesión' })
      expect(loginButton).toHaveAttribute('href', '/login')
    })

    it('"Sign up" button should redirect to /register', () => {
      const signupButton = screen.getByRole('link', { name: 'Registrarse' })
      expect(signupButton).toHaveAttribute('href', '/register')
    })
  })

  describe('when user is authenticated', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      bio: 'Test bio',
      created_at: '2024-01-01',
    }

    const mockLogout = vi.fn()

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        setUser: vi.fn(),
        logout: mockLogout,
      })

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
    })

    it('should render "Write" button that redirects to /posts/create', () => {
      const writeButton = screen.getByRole('link', { name: 'Escribir' })
      expect(writeButton).toHaveAttribute('href', '/posts/create')
    })

    it('should render a link with the user name that redirects to /profile/:userId', () => {
      const userLink = screen.getByRole('link', { name: mockUser.name })
      expect(userLink).toHaveAttribute('href', `/profile/${mockUser.id}`)
    })

    it('should render "Log out" button', () => {
      screen.getByRole('button', { name: 'Cerrar sesión' })
    })

    it('clicking "Log out" should call logout and navigate to "/"', async () => {
      const user = userEvent.setup()

      const logoutButton = screen.getByRole('button', { name: 'Cerrar sesión' })
      await user.click(logoutButton)

      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should NOT render "Log in" and "Sign up" buttons', () => {
      const loginButton = screen.queryByRole('link', { name: 'Iniciar sesión' })
      const signupButton = screen.queryByRole('link', { name: 'Registrarse' })

      expect(loginButton).not.toBeInTheDocument()
      expect(signupButton).not.toBeInTheDocument()
    })
  })
})
