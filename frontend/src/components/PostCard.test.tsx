import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { PostCard } from './PostCard'
import type { Post } from '@/interfaces/Post'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    title: 'Test Post Title',
    content: 'This is a test post content that should be displayed in the card component.',
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    created_at: '2024-01-15T10:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    render(
      <BrowserRouter>
        <PostCard post={mockPost} />
      </BrowserRouter>
    )
  })

  it('should render post title', () => {
    screen.getByRole('heading', { name: mockPost.title })
  })

  it('should render post content', () => {
    screen.getByText(mockPost.content)
  })

  it('should render author name as a link', () => {
    screen.getByRole('link', { name: mockPost.user.name })
  })

  it('should render formatted date', () => {
    screen.getByText('Jan 15, 2024')
  })

  it('should navigate to post detail when clicking on the post area', async () => {
    const user = userEvent.setup()

    const postArea = screen.getByRole('heading', { name: mockPost.title }).closest('div')
    if (postArea) {
      await user.click(postArea)
    }

    expect(mockNavigate).toHaveBeenCalledWith(`/posts/${mockPost.id}`)
  })

  it('author link should redirect to author profile', () => {
    const authorLink = screen.getByRole('link', { name: mockPost.user.name })
    expect(authorLink).toHaveAttribute('href', `/profile/${mockPost.user.id}`)
  })

  it('should display time element with correct datetime attribute', () => {
    const timeElement = document.querySelector('time')
    expect(timeElement).toHaveAttribute('dateTime', mockPost.created_at)
  })

  it('should handle long content with line-clamp', () => {
    const contentElement = screen.getByText(mockPost.content)
    expect(contentElement).toHaveClass('line-clamp-3')
  })
})
