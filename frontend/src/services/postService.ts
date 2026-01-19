import { apiClient } from '@/api/client'
import { HttpMethod } from '@/enums/httpMethods'
import type { Post, PostsResponse } from '@/interfaces/Post'

export const postService = {
  getAll: (page = 1, pageItems = 10) => 
    apiClient<PostsResponse>(`/posts?page=${page}&page_items=${pageItems}`),
  
  getById: (id: string) => apiClient<Post>(`/posts/${id}`),
  
  create: (data: Partial<Post>) =>
    apiClient<Post>('/posts', {
      method: HttpMethod.POST,
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<Post>) =>
    apiClient<Post>(`/posts/${id}`, {
      method: HttpMethod.PUT,
      body: JSON.stringify(data),
    }),
  
}
