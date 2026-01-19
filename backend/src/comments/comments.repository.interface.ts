import { CommentWithUser } from './dto/comment-response.dto';

export interface ICommentsRepository {
  create(data: {
    content: string;
    userId: string;
    postId: string;
  }): Promise<CommentWithUser>;
  
  findByPostId(postId: string, page: number, pageItems: number): Promise<{
    data: CommentWithUser[];
    total: number;
  }>;
}
