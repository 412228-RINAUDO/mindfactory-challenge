import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { CreatePostPage } from './CreatePostPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockMutate = vi.fn()
const mockUseCreatePost = vi.fn()

vi.mock('@/hooks/usePosts', () => ({
  useCreatePost: () => mockUseCreatePost(),
}))

describe('CreatePostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCreatePost.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  it('should render PostForm component', () => {
    render(
      <BrowserRouter>
        <CreatePostPage />
      </BrowserRouter>
    )

    screen.getByTestId('post-title-input')
    screen.getByTestId('post-content-textarea')
  })

  it('should call createPost with correct data when form is submitted', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <CreatePostPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByTestId('post-title-input')
    const contentTextarea = screen.getByTestId('post-content-textarea')

    await user.type(titleInput, 'New Post Title')
    await user.type(contentTextarea, 'New post content')

    const submitButton = screen.getByRole('button', { name: 'Publicar' })
    await user.click(submitButton)

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith(
      { title: 'New Post Title', content: 'New post content' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })

  it('should navigate to home page on successful post creation', async () => {
    const user = userEvent.setup()

    mockMutate.mockImplementation((_data, options) => {
      options.onSuccess()
    })

    render(
      <BrowserRouter>
        <CreatePostPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByTestId('post-title-input')
    const contentTextarea = screen.getByTestId('post-content-textarea')

    await user.type(titleInput, 'New Post Title')
    await user.type(contentTextarea, 'New post content')

    const submitButton = screen.getByRole('button', { name: 'Publicar' })
    await user.click(submitButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
