import { Post, User } from '../../../generated/prisma/client';
import { PostUserResponseDto } from './post-user-response.dto';

export class PostResponseDto {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  user: PostUserResponseDto;
  created_at: Date;

  constructor(post: Post & { user: User; _count: { comments: number } }) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.likes_count = post.likesCount;
    this.comments_count = post._count.comments;
    this.user = new PostUserResponseDto(post.user);
    this.created_at = post.createdAt;
  }
}
