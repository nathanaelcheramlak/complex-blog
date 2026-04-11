import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createPaginationMeta,
  PaginatedResponse,
  PaginationQueryDto,
} from 'src/common/dto/pagination.dto';
import { FollowEntity } from 'src/follow/entities/follow.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepo: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async checkFollow(followerId: number, followingId: number): Promise<boolean> {
    const isFollowing: FollowEntity | null = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    return !!isFollowing;
  }

  async createFollow(
    followerId: number,
    followingId: number,
  ): Promise<FollowEntity> {
    if (followingId === followerId) {
      throw new BadRequestException('You connot follow your self.');
    }

    const targetUser: UserEntity | null = await this.userRepo.findOneBy({
      id: followingId,
    });

    if (!targetUser) {
      throw new NotFoundException('User not found.');
    }

    const isFollowing: boolean = await this.checkFollow(
      followerId,
      followingId,
    );

    if (isFollowing) {
      throw new ConflictException('You are already following this user.');
    }

    const follow: FollowEntity = this.followRepo.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    return this.followRepo.save(follow);
  }

  async getFollowers(
    userId: number,
    input?: PaginationQueryDto,
  ): Promise<
    PaginatedResponse<UserEntity & { followerAt: Date; followRecordId: number }>
  > {
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [followers, count] = await this.followRepo.findAndCount({
      where: { following: { id: userId } },
      relations: { follower: true },
      skip: skip,
      take: limit,
      select: { follower: { id: true, name: true, bio: true, avatar: true } },
    });

    return {
      data: followers.map((f) => ({
        ...f.follower,
        followerAt: f.createdAt,
        followRecordId: f.id,
      })),
      meta: createPaginationMeta(count, page, limit),
    };
  }

  async getFollowing(
    userId: number,
    input?: PaginationQueryDto,
  ): Promise<
    PaginatedResponse<
      UserEntity & { followingAt: Date; followRecordId: number }
    >
  > {
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [following, count] = await this.followRepo.findAndCount({
      where: { follower: { id: userId } },
      relations: { following: true },
      skip: skip,
      take: limit,
      select: { following: { id: true, name: true, bio: true, avatar: true } },
    });

    return {
      data: following.map((f) => ({
        ...f.following,
        followingAt: f.createdAt,
        followRecordId: f.id,
      })),
      meta: createPaginationMeta(count, page, limit),
    };
  }

  async getFollowStatus(
    userId: number,
  ): Promise<{ followers: number; following: number }> {
    const [followers, following] = await Promise.all([
      this.followRepo.count({ where: { following: { id: userId } } }),
      this.followRepo.count({ where: { follower: { id: userId } } }),
    ]);

    return { followers, following };
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    const follow: FollowEntity | null = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user.');
    }

    await this.followRepo.remove(follow);
  }
}
