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
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from 'src/comment/dtos/create-comment.dto';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  CursorPaginatedRespose,
  CursorPaginationDto,
} from 'src/common/dto/cursor-pagination.dto';
import {
  PaginatedResponse,
  PaginationMeta,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { LikeEntity } from 'src/like/entities/like.entity';
import { LikeService } from 'src/like/like.service';
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
  public constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

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

  /*
   * Comments per post id
   */
  @Get(':postId/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiQuery({
    name: 'cursor',
    type: String,
    required: false,
    description: 'Cursor for pagination (format: ISO_DATE_ID)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items to return (max 15)',
  })
  @ApiOkResponse({ description: 'List of comments with pagination cursor' })
  async getComments(
    @Param('postId') postId: number,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ): Promise<CursorPaginatedRespose<CommentEntity>> {
    return this.commentService.getcommentsByPost(postId, cursorPaginationDto);
  }

  /*
   * create comment
   */
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @ApiOperation({ summary: 'Create a comment for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiCreatedResponse({ description: 'Comment created', type: CommentEntity })
  async createComment(
    @CurrentUser('userId') userId: number,
    @Param('postId') postId: number,
    @Body() body: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(postId, userId, body);
  }

  /*
   * Likes per post
   */
  @Get(':postId/likes')
  @ApiOperation({ summary: 'Get like count for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Number of likes', type: Number })
  async getLikes(@Param('postId') postId: number): Promise<number> {
    return this.likeService.getLikeByPost(postId);
  }

  /*
   * create like
   */
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post(':postId/likes')
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Post liked' })
  async createLike(
    @CurrentUser('userId') userId: number,
    @Param('postId') postId: number,
  ): Promise<LikeEntity> {
    return this.likeService.createLike(userId, postId);
  }

  /*
   * delete like
   */
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId/likes')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiNoContentResponse({ description: 'Like removed' })
  async deleteLike(
    @CurrentUser('userId') userId: number,
    @Param('postId') postId: number,
  ): Promise<void> {
    return this.likeService.deleteLike(userId, postId);
  }
}
