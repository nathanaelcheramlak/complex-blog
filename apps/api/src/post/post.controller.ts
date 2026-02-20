import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostEntity } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Posts' })
  async findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }
}
