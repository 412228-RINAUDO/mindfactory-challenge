import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { Public } from 'src/public/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsService.findAll();
    return posts.map(post => new PostResponseDto(post));
  }
}
