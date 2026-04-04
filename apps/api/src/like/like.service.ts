import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from 'src/like/entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly likeRepo: Repository<LikeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getLikeByPost(postId: number): Promise<number> {
    const post: PostEntity | null = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const count: number = await this.likeRepo.count({
      where: {
        post: { id: postId },
      },
    });

    return count;
  }

  async hasLiked(userId: number, postId: number): Promise<boolean> {
    const like = await this.likeRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    return !!like;
  }

  async createLike(userId: number, postId: number): Promise<LikeEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    const post: PostEntity | null = await this.postRepo.findOneBy({
      id: postId,
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const like: LikeEntity = this.likeRepo.create({
      user,
      post,
    });

    await this.likeRepo.save(like);

    const createdLike: LikeEntity | null = await this.likeRepo
      .createQueryBuilder('likes')
      .leftJoin('likes.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .leftJoin('likes.post', 'post')
      .addSelect(['post.id', 'post.title'])
      .where('likes.id = :id', { id: like.id })
      .getOne();

    if (!createdLike) {
      throw new NotFoundException('Like not found.');
    }

    return createdLike;
  }

  async deleteLike(userId: number, postId: number): Promise<void> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    const like: LikeEntity | null = await this.likeRepo.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    if (!like) {
      throw new NotFoundException('Like not found.');
    }

    await this.likeRepo.remove(like);
  }
}
