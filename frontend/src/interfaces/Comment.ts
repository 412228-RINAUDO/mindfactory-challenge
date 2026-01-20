import type { User } from "./User";

export interface Comment {
    content: string
    post_id: number
    created_at: string
    user: Omit<User , "password">
}

export interface CommentsResponse {
    data: Comment[]
    meta: {
        page: number
        pageItems: number
        totalPages: number
        totalItems: number
    }
}
