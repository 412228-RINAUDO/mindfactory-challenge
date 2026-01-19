import { Post, User, Comment } from '../../../generated/prisma/client';
import { PostUserResponseDto } from './post-user-response.dto';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';

export class PostDetailResponseDto {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  user: PostUserResponseDto;
  created_at: Date;
  comments: CommentResponseDto[];

  constructor(post: Post & { user: User; comments: (Comment & { user: Pick<User, 'id' | 'name' | 'email'> })[] }) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.likes_count = post.likesCount;
    this.user = new PostUserResponseDto(post.user);
    this.created_at = post.createdAt;
    this.comments = post.comments.map(comment => new CommentResponseDto(comment));
  }
}
