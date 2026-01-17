import { apiClient } from '@/api/client'
import type { Post, PostsResponse } from '@/interfaces/Post'

export const postService = {
  getAll: () => apiClient<PostsResponse>('/posts'),
  
  getById: (id: string) => apiClient<Post>(`/posts/${id}`),
  
  create: (data: Partial<Post>) =>
    apiClient<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<Post>) =>
    apiClient<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiClient<void>(`/posts/${id}`, {
      method: 'DELETE',
    }),
}
