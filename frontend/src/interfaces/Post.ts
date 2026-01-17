export interface User {
  id: string
  name: string
  email: string
}

export interface Post {
  id: string
  title: string
  content: string
  user: User
  createdAt: string
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
