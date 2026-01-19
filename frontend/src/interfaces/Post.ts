import type { Comment } from "./Comment";

export interface UserPost {
  id: string
  name: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
  user: UserPost
  created_at: string
  likes_count: number
  is_liked: boolean
  comments_count: number
}

export interface PostDetail extends Omit<Post, 'comments_count' | 'is_liked'> {
  comments: Comment[]
  is_liked: boolean
}

export interface PostsResponse {
  data: Post[]
  meta: {
    page: number
    pageItems: number
    total: number
    totalPages: number
  }
}
