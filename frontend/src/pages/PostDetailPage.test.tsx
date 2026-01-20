import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { PostDetailPage } from './PostDetailPage'

const mockNavigate = vi.fn()
const mockUseParams = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  }
})

const mockUsePost = vi.fn()
const mockUseCreateComment = vi.fn()
const mockUseToggleLike = vi.fn()
const mockUseInfiniteComments = vi.fn()

vi.mock('@/hooks/usePosts', () => ({
  usePost: (id: string) => mockUsePost(id),
  useCreateComment: () => mockUseCreateComment(),
  useToggleLike: () => mockUseToggleLike(),
  useInfiniteComments: () => mockUseInfiniteComments(),
}))

const mockUseAuth = vi.fn()

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext')
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  }
})

describe('PostDetailPage', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post Title',
    content: 'This is the post content.\nSecond paragraph here.',
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    created_at: '2024-01-15T10:00:00Z',
    comments_count: 0,
    likes_count: 0,
    is_liked: false,
    likes: [],
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
    mockUseParams.mockReturnValue({ id: '1' })
    mockUseAuth.mockReturnValue({
      user: null,
      setUser: vi.fn(),
      logout: vi.fn(),
    })
    mockUseCreateComment.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mockUseToggleLike.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
    mockUseInfiniteComments.mockReturnValue({
      data: { pages: [{ data: [] }] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })
  })

  describe('Loading state', () => {
    it('should show loading spinner while fetching post', () => {
      mockUsePost.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const loader = document.querySelector('.animate-spin')
      expect(loader).not.toBeNull()
    })
  })

  describe('Error/Not found state', () => {
    it('should show "Post not found" message when post does not exist', () => {
      mockUsePost.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Not found'),
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      screen.getByText('Post no encontrado')
    })

    it('should show "Back to posts" link when post not found', () => {
      mockUsePost.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Not found'),
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const backLink = screen.getByRole('link', { name: 'Todos los posts' })
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Successful load', () => {
    beforeEach(() => {
      mockUsePost.mockReturnValue({
        data: mockPost,
        isLoading: false,
        error: null,
      })
    })

    it('should render post title', () => {
      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      screen.getByRole('heading', { name: mockPost.title })
    })

    it('should render post content', () => {
      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      expect(screen.getByText(/this is the post content/i)).toBeInTheDocument()
      expect(screen.getByText(/second paragraph here/i)).toBeInTheDocument()
    })

    it('should render author name as link', () => {
      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const authorLink = screen.getByRole('link', { name: mockPost.user.name })
      expect(authorLink).toHaveAttribute('href', `/profile/${mockPost.user.id}`)
    })

    it('should render formatted date', () => {
      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      screen.getByText(/15 ene 2024, \d{2}:\d{2}/)
    })

    it('should render "All posts" back link', () => {
      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const backLink = screen.getByRole('link', { name: 'Todos los posts' })
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Owner permissions', () => {
    beforeEach(() => {
      mockUsePost.mockReturnValue({
        data: mockPost,
        isLoading: false,
        error: null,
      })
    })

    it('should show "Edit post" button when current user is the post owner', () => {
      mockUseAuth.mockReturnValue({
        user: mockCurrentUser,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      screen.getByRole('button', { name: 'Editar publicación' })
    })

    it('should NOT show "Edit post" button when current user is not the owner', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockCurrentUser, id: '999' },
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const editButton = screen.queryByRole('button', { name: 'Editar publicación' })
      expect(editButton).not.toBeInTheDocument()
    })

    it('should NOT show "Edit post" button when no user is logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: vi.fn(),
        logout: vi.fn(),
      })

      render(
        <BrowserRouter>
          <PostDetailPage />
        </BrowserRouter>
      )

      const editButton = screen.queryByRole('button', { name: 'Editar publicación' })
      expect(editButton).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to edit page when "Edit post" button is clicked', async () => {
      const user = userEvent.setup()

      mockUsePost.mockReturnValue({
        data: mockPost,
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
          <PostDetailPage />
        </BrowserRouter>
      )

      const editButton = screen.getByRole('button', { name: 'Editar publicación' })
      await user.click(editButton)

      expect(mockNavigate).toHaveBeenCalledWith('/posts/1/edit')
    })
  })
})
