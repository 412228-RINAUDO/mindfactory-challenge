import { Post, User, Comment } from '../../generated/prisma/client';

type PostWithUserAndCommentsCount = Post & { 
  user: User; 
  _count: { comments: number };
};

type PostWithUserAndComments = Post & { 
  user: User; 
  comments: (Comment & { user: Pick<User, 'id' | 'name' | 'email'> })[];
};

export interface IPostsRepository {
  findAll(page: number, limit: number): Promise<{
    data: PostWithUserAndCommentsCount[];
    total: number;
  }>;
  findById(id: string): Promise<PostWithUserAndComments | null>;
  create(data: { title: string; content: string; userId: string }): Promise<PostWithUserAndCommentsCount>;
  update(id: string, data: { title?: string; content?: string }): Promise<PostWithUserAndCommentsCount>;
  incrementLikes(id: string): Promise<PostWithUserAndCommentsCount>;
  decrementLikes(id: string): Promise<PostWithUserAndCommentsCount>;
}
