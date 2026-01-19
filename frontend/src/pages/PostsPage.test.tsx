import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PostsPage } from './PostsPage'

// Mock usePosts hook
const mockUsePosts = vi.fn()

vi.mock('@/hooks/usePosts', () => ({
  usePosts: () => mockUsePosts(),
}))

// Mock useAuth hook
const mockUseAuth = vi.fn()

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

describe('PostsPage', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'First Post',
      content: 'Content of first post',
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      },
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'Content of second post',
      user: {
        id: '456',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      created_at: '2024-01-16T10:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      setUser: vi.fn(),
      logout: vi.fn(),
    })
  })

  describe('Rendering', () => {
    it('should render page title and description', () => {
      mockUsePosts.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      screen.getByRole('heading', { name: 'Ideas worth sharing' })
      screen.getByText(/a space for writers and thinkers/i)
    })
  })

  describe('User authentication states', () => {
    beforeEach(() => {
      mockUsePosts.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      })
    })

    it('should show "Start writing" button when user is NOT logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      screen.getByRole('link', { name: 'Start writing' })
    })

    it('should NOT show "Start writing" button when user is logged in', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'Test bio',
          created_at: '2024-01-01',
        },
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      const startWritingButton = screen.queryByRole('link', { name: 'Start writing' })
      expect(startWritingButton).not.toBeInTheDocument()
    })

    it('"Start writing" button should link to /login', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      const startWritingButton = screen.getByRole('link', { name: 'Start writing' })
      expect(startWritingButton).toHaveAttribute('href', '/login')
    })
  })

  describe('Loading state', () => {
    it('should show loading message while fetching posts', () => {
      mockUsePosts.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      screen.getByText('Loading posts...')
    })
  })

  describe('Error state', () => {
    it('should show error message when posts fail to load', () => {
      mockUsePosts.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch'),
      })

      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      screen.getByText(/error loading posts: failed to fetch/i)
    })
  })

  describe('Success state', () => {
    beforeEach(() => {
      mockUsePosts.mockReturnValue({
        data: { data: mockPosts },
        isLoading: false,
        error: null,
      })
    })

    it('should render list of posts when data is loaded', () => {
      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      screen.getByRole('heading', { name: 'First Post' })
      screen.getByRole('heading', { name: 'Second Post' })
    })

    it('should render correct number of posts', () => {
      render(
        <BrowserRouter>
          <PostsPage />
        </BrowserRouter>
      )

      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(2)
    })
  })
})
