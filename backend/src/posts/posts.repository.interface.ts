import { Post, User } from '../../generated/prisma/client';

export interface IPostsRepository {
  findAll(page: number, limit: number): Promise<{
    data: (Post & { user: User })[];
    total: number;
  }>;
  findById(id: string): Promise<(Post & { user: User }) | null>;
  create(data: { title: string; content: string; userId: string }): Promise<Post & { user: User }>;
  update(id: string, data: { title?: string; content?: string }): Promise<Post & { user: User }>;
  incrementLikes(id: string): Promise<Post & { user: User }>;
  decrementLikes(id: string): Promise<Post & { user: User }>;
}
