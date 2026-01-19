import { Post, User, Like } from '../../generated/prisma/client';

export type PostWithUserAndCommentsCount = Post & { 
  user: User; 
  _count: { comments: number; likes: number };
  likes?: Like[];
};

export type PostWithUser = Post & { 
  user: User; 
  _count: { likes: number };
  likes?: Like[];
};

export interface IPostsRepository {
  findAll(page: number, limit: number, userId?: string): Promise<{
    data: PostWithUserAndCommentsCount[];
    total: number;
  }>;
  findById(id: string, userId?: string): Promise<PostWithUser | null>;
  create(data: { title: string; content: string; userId: string }): Promise<PostWithUserAndCommentsCount>;
  update(id: string, data: { title?: string; content?: string }): Promise<PostWithUserAndCommentsCount>;
  createLike(postId: string, userId: string): Promise<Like>;
  deleteLike(postId: string, userId: string): Promise<Like>;
  findLike(postId: string, userId: string): Promise<Like | null>;
}
