import { Post, User, Comment, Like } from '../../generated/prisma/client';

export type PostWithUserAndCommentsCount = Post & { 
  user: User; 
  _count: { comments: number; likes: number };
  likes?: Like[];
};

export type PostWithUserAndComments = Post & { 
  user: User; 
  comments: (Comment & { user: Pick<User, 'id' | 'name' | 'email'> })[];
  _count: { likes: number };
};

export interface IPostsRepository {
  findAll(page: number, limit: number, userId?: string): Promise<{
    data: PostWithUserAndCommentsCount[];
    total: number;
  }>;
  findById(id: string): Promise<PostWithUserAndComments | null>;
  create(data: { title: string; content: string; userId: string }): Promise<PostWithUserAndCommentsCount>;
  update(id: string, data: { title?: string; content?: string }): Promise<PostWithUserAndCommentsCount>;
  createLike(postId: string, userId: string): Promise<Like>;
  deleteLike(postId: string, userId: string): Promise<Like>;
  findLike(postId: string, userId: string): Promise<Like | null>;
}
