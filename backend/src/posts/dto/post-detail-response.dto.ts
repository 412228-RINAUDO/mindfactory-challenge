import { PostUserResponseDto } from './post-user-response.dto';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto';
import { PostWithUserAndComments } from '../posts.repository.interface';

export class PostDetailResponseDto {
  id: string;
  title: string;
  content: string;
  likes_count: number;
  is_liked: boolean;
  user: PostUserResponseDto;
  created_at: Date;
  comments: CommentResponseDto[];

  constructor(post: PostWithUserAndComments) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.likes_count = post._count.likes;
    this.is_liked = post.likes ? post.likes.length > 0 : false;
    this.user = new PostUserResponseDto(post.user);
    this.created_at = post.createdAt;
    this.comments = post.comments.map(comment => new CommentResponseDto(comment));
  }
}
