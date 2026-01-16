import { Post, User } from '../../generated/prisma/client';

export interface IPostsRepository {
  findAll(): Promise<(Post & { user: User })[]>;
}
