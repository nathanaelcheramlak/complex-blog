import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('me')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user profile', type: UserEntity })
  async getMe(@CurrentUser('userId') userId: number): Promise<UserEntity> {
    return this.userService.findById(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User profile', type: UserEntity })
  async getUserById(@Param('id') id: number): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Get(':id/posts')
  @ApiOperation({ summary: 'Get posts by author' })
  @ApiParam({ name: 'id', type: Number, description: 'Author ID' })
  @ApiOkResponse({ description: 'Posts by author', type: [PostEntity] })
  async getPostsByAuthor(
    @Param('id') authorId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.postService.listPosts(paginationQueryDto, authorId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'User profile updated', type: UserEntity })
  async updateUser(
    @CurrentUser('userId') userId: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(userId, body);
  }
}
