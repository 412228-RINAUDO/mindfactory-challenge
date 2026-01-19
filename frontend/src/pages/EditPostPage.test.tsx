import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { EditPostPage } from './EditPostPage'

// Mock useNavigate and useParams hooks
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

// Mock usePost and useUpdatePost hooks
const mockUsePost = vi.fn()
const mockUseUpdatePost = vi.fn()

vi.mock('@/hooks/usePosts', () => ({
  usePost: (id: string) => mockUsePost(id),
  useUpdatePost: () => mockUseUpdatePost(),
}))

describe('EditPostPage', () => {
  const mockPost = {
    id: '1',
    title: 'Existing Post Title',
    content: 'Existing post content',
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    created_at: '2024-01-15T10:00:00Z',
  }

  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ id: '1' })
    mockUseUpdatePost.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  it('should show loading spinner while fetching post', () => {
    mockUsePost.mockReturnValue({
      data: null,
      isLoading: true,
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    const loader = document.querySelector('.animate-spin')
    expect(loader).not.toBeNull()
  })

  it('should show "Post not found" message when post does not exist', () => {
    mockUsePost.mockReturnValue({
      data: null,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    screen.getByText('Post not found')
  })

  it('should render PostForm with initial post data', () => {
    mockUsePost.mockReturnValue({
      data: mockPost,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByTestId('post-title-input') as HTMLInputElement
    const contentTextarea = screen.getByTestId('post-content-textarea') as HTMLTextAreaElement

    expect(titleInput.value).toBe(mockPost.title)
    expect(contentTextarea.value).toBe(mockPost.content)
  })

  it('should pass isEditing=true to PostForm', () => {
    mockUsePost.mockReturnValue({
      data: mockPost,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    screen.getByRole('button', { name: 'Update post' })
  })

  it('should call updatePost with correct data when form is submitted', async () => {
    const user = userEvent.setup()

    mockUsePost.mockReturnValue({
      data: mockPost,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByTestId('post-title-input')
    const contentTextarea = screen.getByTestId('post-content-textarea')

    await user.clear(titleInput)
    await user.clear(contentTextarea)
    await user.type(titleInput, 'Updated Title')
    await user.type(contentTextarea, 'Updated content')

    const submitButton = screen.getByRole('button', { name: 'Update post' })
    await user.click(submitButton)

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith(
      { id: '1', data: { title: 'Updated Title', content: 'Updated content' } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })

  it('should navigate to post detail page on successful update', async () => {
    const user = userEvent.setup()

    mockUsePost.mockReturnValue({
      data: mockPost,
      isLoading: false,
    })

    mockMutate.mockImplementation((_data, options) => {
      options.onSuccess()
    })

    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByTestId('post-title-input')
    const contentTextarea = screen.getByTestId('post-content-textarea')

    await user.clear(titleInput)
    await user.clear(contentTextarea)
    await user.type(titleInput, 'Updated Title')
    await user.type(contentTextarea, 'Updated content')

    const submitButton = screen.getByRole('button', { name: 'Update post' })
    await user.click(submitButton)

    expect(mockNavigate).toHaveBeenCalledWith('/posts/1')
  })
})
