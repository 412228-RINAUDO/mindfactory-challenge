import { Post, User } from '../../generated/prisma/client';

export interface IPostsRepository {
  findAll(): Promise<(Post & { user: User })[]>;
  findById(id: string): Promise<(Post & { user: User }) | null>;
  create(data: { title: string; content: string; userId: string }): Promise<Post & { user: User }>;
}
