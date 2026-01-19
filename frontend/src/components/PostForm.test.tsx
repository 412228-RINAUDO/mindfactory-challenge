import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { PostForm } from './PostForm'

// Mock useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('PostForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )
    })

    it('should render title input with placeholder', () => {
      screen.getByTestId('post-title-input')
    })

    it('should render content textarea with placeholder', () => {
      screen.getByTestId('post-content-textarea')
    })

    it('should render submit button', () => {
      screen.getByRole('button', { name: 'Publish post' })
    })

    it('should render cancel button', () => {
      screen.getByRole('button', { name: 'Cancel' })
    })
  })

  describe('Initial values', () => {
    it('should display initial title when provided', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} initialTitle="Test Title" />
        </BrowserRouter>
      )

      const titleInput = screen.getByTestId('post-title-input') as HTMLInputElement
      expect(titleInput.value).toBe('Test Title')
    })

    it('should display initial content when provided', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} initialContent="Test Content" />
        </BrowserRouter>
      )

      const contentTextarea = screen.getByTestId('post-content-textarea') as HTMLTextAreaElement
      expect(contentTextarea.value).toBe('Test Content')
    })

    it('should have empty inputs when no initial values provided', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const titleInput = screen.getByTestId('post-title-input') as HTMLInputElement
      const contentTextarea = screen.getByTestId('post-content-textarea') as HTMLTextAreaElement

      expect(titleInput.value).toBe('')
      expect(contentTextarea.value).toBe('')
    })
  })

  describe('Form validation', () => {
    it('submit button should be disabled when title is empty', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} initialContent="Some content" />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Publish post' })
      expect(submitButton).toBeDisabled()
    })

    it('submit button should be disabled when content is empty', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} initialTitle="Some title" />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Publish post' })
      expect(submitButton).toBeDisabled()
    })

    it('submit button should be disabled when both are empty', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Publish post' })
      expect(submitButton).toBeDisabled()
    })

    it('submit button should be enabled when both fields have content', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} initialTitle="Title" initialContent="Content" />
        </BrowserRouter>
      )

      const submitButton = screen.getByRole('button', { name: 'Publish post' })
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Form submission', () => {
    it('should call onSubmit with form data when submitted', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const titleInput = screen.getByTestId('post-title-input')
      const contentTextarea = screen.getByTestId('post-content-textarea')

      await user.type(titleInput, 'My Test Title')
      await user.type(contentTextarea, 'My test content')

      const submitButton = screen.getByRole('button', { name: 'Publish post' })
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'My Test Title',
        content: 'My test content',
      })
    })

    it('should show "Saving..." text when isSubmitting is true', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} isSubmitting={true} initialTitle="Title" initialContent="Content" />
        </BrowserRouter>
      )

      screen.getByRole('button', { name: 'Saving...' })
    })
  })

  describe('Button text variations', () => {
    it('should show "Publish post" when isEditing is false', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} isEditing={false} />
        </BrowserRouter>
      )

      screen.getByRole('button', { name: 'Publish post' })
    })

    it('should show "Update post" when isEditing is true', () => {
      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} isEditing={true} />
        </BrowserRouter>
      )

      screen.getByRole('button', { name: 'Update post' })
    })
  })

  describe('User interactions', () => {
    it('should update title when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const titleInput = screen.getByTestId('post-title-input') as HTMLInputElement

      await user.type(titleInput, 'New Title')

      expect(titleInput.value).toBe('New Title')
    })

    it('should update content when user types', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const contentTextarea = screen.getByTestId('post-content-textarea') as HTMLTextAreaElement

      await user.type(contentTextarea, 'New content')

      expect(contentTextarea.value).toBe('New content')
    })

    it('should navigate back when cancel button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <PostForm onSubmit={mockOnSubmit} />
        </BrowserRouter>
      )

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })
  })
})
