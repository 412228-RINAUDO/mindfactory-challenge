import { Comment, User } from '../../../generated/prisma';

export type CommentWithUser = Comment & { user: Pick<User, 'id' | 'name' | 'email'> };

export class CommentUserResponseDto {
  id: string;
  name: string;
  email: string;
}

export class CommentResponseDto {
  id: string;
  content: string;
  post_id: string;
  created_at: Date;
  user: CommentUserResponseDto;

  constructor(comment: CommentWithUser) {
    this.id = comment.id;
    this.content = comment.content;
    this.post_id = comment.postId;
    this.created_at = comment.createdAt;
    this.user = {
      id: comment.user.id,
      name: comment.user.name,
      email: comment.user.email,
    };
  }
}
