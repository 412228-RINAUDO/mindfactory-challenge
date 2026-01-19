import type { Comment } from "./Comment"

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
  likesCount?: number
  comments: Comment[]
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
