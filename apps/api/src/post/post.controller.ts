import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  PaginatedResponse,
  PaginationMeta,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';

class PaginatedPostsResponse implements PaginatedResponse<PostEntity> {
  data!: PostEntity[];
  meta!: PaginationMeta;
}

class ListPostsDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'List of posts with pagination metadata',
    type: PaginatedPostsResponse,
  })
  @IsOptional()
  @IsString()
  tag?: string;
}

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Posts' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'tag',
    type: String,
    required: false,
    description: 'Filter by tag',
  })
  @ApiOkResponse({
    description: 'List of posts with pagination metadata',
    type: PaginatedPostsResponse,
  })
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: false }))
  async listBlogs(
    @Query()
    paginationQueryDto: ListPostsDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.postService.listPosts({ ...paginationQueryDto });
  }
}
