import { PostUserResponseDto } from './post-user-response.dto';
import { PostWithUser } from '../posts.repository.interface';

export class PostDetailResponseDto {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  is_liked: boolean;
  user: PostUserResponseDto;
  created_at: Date;

  constructor(post: PostWithUser) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.likes_count = post._count.likes;
    this.is_liked = post.likes ? post.likes.length > 0 : false;
    this.user = new PostUserResponseDto(post.user);
    this.created_at = post.createdAt;
  }
}
