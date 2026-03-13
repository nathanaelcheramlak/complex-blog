import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  PaginatedResponse,
  PaginationMeta,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { CreatePostDto } from 'src/post/dtos/create-post.dto';
import { UpdatePostDto } from 'src/post/dtos/update-post.dto';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Post found', type: PostEntity })
  async getPostById(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

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

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiCreatedResponse({ description: 'Post created', type: PostEntity })
  async createPost(
    @CurrentUser('userId') userId: number,
    @Body() body: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postService.createPost(userId, body);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Post updated', type: PostEntity })
  async updatePost(
    @CurrentUser('userId') userId: number,
    @Param('id') id: number,
    @Body() body: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.updatePost(userId, id, body);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiNoContentResponse({ description: 'Post deleted' })
  async deletePost(
    @CurrentUser('userId') userId: number,
    @Param('id') id: number,
  ): Promise<void> {
    return this.postService.deletePost(userId, id);
  }
}
