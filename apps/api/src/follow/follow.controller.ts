import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { FollowEntity } from 'src/follow/entities/follow.entity';
import { FollowService } from 'src/follow/follow.service';
import { UserEntity } from 'src/user/entities/user.entity';

@ApiTags('Follows')
@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of user to follow',
  })
  @ApiCreatedResponse({
    description: 'Successfully followed user',
    type: FollowEntity,
  })
  async followUser(
    @CurrentUser('userId') followerId: number,
    @Param('userId') followingId: number,
  ): Promise<FollowEntity> {
    return this.followService.createFollow(followerId, followingId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of user to unfollow',
  })
  @ApiNoContentResponse({ description: 'Successfully unfollowed user' })
  async unfollowUser(
    @CurrentUser('userId') followerId: number,
    @Param('userId') followingId: number,
  ): Promise<void> {
    return this.followService.deleteFollow(followerId, followingId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':userId/check')
  @ApiOperation({ summary: 'Check if current user follows someone' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID of user to check',
  })
  @ApiOkResponse({
    description: 'Returns whether current user follows target',
    schema: { example: { following: true } },
  })
  async checkFollow(
    @CurrentUser('userId') followerId: number,
    @Param('userId') followingId: number,
  ): Promise<{ following: boolean }> {
    const following: boolean = await this.followService.checkFollow(
      followerId,
      followingId,
    );

    return { following };
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: "Get user's followers" })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'User ID',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({
    description: 'List of followers',
  })
  async getFollowers(
    @Param('userId') userId: number,
    @Query() pagination?: PaginationQueryDto,
  ): Promise<
    PaginatedResponse<UserEntity & { followerAt: Date; followRecordId: number }>
  > {
    return this.followService.getFollowers(userId, pagination);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get who user follows' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'User ID',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiOkResponse({ description: 'List of following' })
  async getFollowing(
    @Param('userId') userId: number,
    @Query() pagination?: PaginationQueryDto,
  ): Promise<
    PaginatedResponse<
      UserEntity & { followingAt: Date; followRecordId: number }
    >
  > {
    return this.followService.getFollowing(userId, pagination);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get follow counts' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'User ID',
  })
  @ApiOkResponse({
    description: 'Follower and following counts',
    schema: { example: { followers: 10, following: 5 } },
  })
  async getFollowStats(
    @Param('userId') userId: number,
  ): Promise<{ followers: number; following: number }> {
    return this.followService.getFollowStatus(userId);
  }
}
