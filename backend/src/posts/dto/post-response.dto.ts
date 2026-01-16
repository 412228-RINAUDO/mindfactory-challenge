import { Post, User } from '../../../generated/prisma/client';
import { PostUserResponseDto } from './post-user-response.dto';

export class PostResponseDto {
  id: string;
  title: string;
  content: string;
  user: PostUserResponseDto;
  createdAt: Date;

  constructor(post: Post & { user: User }) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.user = new PostUserResponseDto(post.user);
    this.createdAt = post.createdAt;
  }
}
