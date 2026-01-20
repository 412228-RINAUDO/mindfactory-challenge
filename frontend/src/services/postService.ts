import { apiClient } from '@/api/client'
import { HttpMethod } from '@/enums/httpMethods'
import type { Post, PostsResponse, PostDetail } from '@/interfaces/Post'
import type { Comment, CommentsResponse } from '@/interfaces/Comment'

export const postService = {
  getAll: (page = 1, pageItems = 10) => 
    apiClient<PostsResponse>(`/posts?page=${page}&page_items=${pageItems}`),
  
  getById: (id: string) => apiClient<PostDetail>(`/posts/${id}`),
  
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
  
  createComment: (postId: string, data: { content: string }) =>
    apiClient<Comment>(`/posts/${postId}/comments`, {
      method: HttpMethod.POST,
      body: JSON.stringify(data),
    }),
  
  like: (id: string) =>
    apiClient<Post>(`/posts/${id}/like`, {
      method: HttpMethod.PATCH,
    }),
  
  unlike: (id: string) =>
    apiClient<Post>(`/posts/${id}/unlike`, {
      method: HttpMethod.PATCH,
    }),
  
  toggleLike: (id: string, isLiked: boolean) =>
    isLiked ? postService.unlike(id) : postService.like(id),
  
  getComments: (postId: string, page = 1, pageItems = 5) =>
    apiClient<CommentsResponse>(`/posts/${postId}/comments?page=${page}&page_items=${pageItems}`),
}
