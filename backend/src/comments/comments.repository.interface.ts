import { CommentWithUser } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

export interface ICommentsRepository {
  create(data: CreateCommentDto & { userId: string }): Promise<CommentWithUser>;
  findByPostId(postId: string, page: number, pageItems: number): Promise<{
    data: CommentWithUser[];
    total: number;
  }>;
}
