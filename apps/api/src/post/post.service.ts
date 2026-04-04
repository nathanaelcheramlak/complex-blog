import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createPaginationMeta,
  PaginatedResponse,
} from 'src/common/dto/pagination.dto';
import { CreatePostDto } from 'src/post/dtos/create-post.dto';
import { UpdatePostDto } from 'src/post/dtos/update-post.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  async createPost(userId: number, input: CreatePostDto): Promise<PostEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    if (input.slug) {
      const existingSlug: PostEntity | null = await this.postRepo.findOne({
        where: { slug: input.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Slug already exists.');
      }
    }

    const existingPost: PostEntity | null = await this.postRepo.findOne({
      where: { title: input.title },
    });

    if (existingPost) {
      throw new ConflictException('Post already exists.');
    }

    const post: PostEntity = this.postRepo.create({
      ...input,
      user,
    });

    if (input.tagIds && input.tagIds.length > 0) {
      const tags: TagEntity[] = await this.tagRepo.findBy({
        id: In(input.tagIds),
      });

      if (tags.length !== input.tagIds.length) {
        throw new NotFoundException('Some tags not found.');
      }

      post.tags = tags;
    }

    await this.postRepo.save(post);

    const createdPost: PostEntity | null = await this.postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .leftJoin('posts.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .where('posts.id = :id', { id: post.id })
      .getOne();

    if (!createdPost) {
      throw new NotFoundException('Post not found.');
    }

    return createdPost;
  }

  async getPostById(postId: number): Promise<PostEntity> {
    const post: PostEntity | null = await this.postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .leftJoin('posts.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .where('posts.id = :id', { id: postId })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async listPosts(input: {
    readonly page?: number;
    readonly limit?: number;
    readonly tag?: string;
  }): Promise<PaginatedResponse<PostEntity>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .leftJoin('posts.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar']);

    if (input.tag) {
      const tags = input.tag.split(',');
      queryBuilder.andWhere('tags.name IN (:...tags)', { tags });
    }

    queryBuilder.skip(skip).take(limit);

    // ordering will be implemented later

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      data: posts,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  async getRelatedPosts(
    postId: number,
    limit: number = 5,
  ): Promise<PostEntity[]> {
    const post: PostEntity | null = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['tags'],
    });

    if (!post || !post.tags.length) {
      return [];
    }

    const tagIds = post.tags.map((t) => t.id);

    return this.postRepo
      .createQueryBuilder('post')
      .leftJoin('post.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .andWhere('post.id != :postId', { postId })
      .andWhere('post.published = :published', { published: true })
      .orderBy('post.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async updatePost(
    userId: number,
    postId: number,
    input: UpdatePostDto,
  ): Promise<PostEntity> {
    const post: PostEntity | null = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('Not the post owner.');
    }

    if (input.slug) {
      const existingSlug: PostEntity | null = await this.postRepo.findOne({
        where: { slug: input.slug },
      });

      if (existingSlug && existingSlug.id !== postId) {
        throw new ConflictException('Slug already exists.');
      }
    }

    if (input.tagIds) {
      const tags: TagEntity[] = await this.tagRepo.findBy({
        id: In(input.tagIds),
      });

      if (tags.length !== input.tagIds.length) {
        throw new NotFoundException('Some tags not found.');
      }

      post.tags = tags;
    }

    const updatedPost: PostEntity = this.postRepo.merge(post, { ...input });

    await this.postRepo.save(updatedPost);

    const result: PostEntity | null = await this.postRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.tags', 'tags')
      .leftJoin('posts.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .where('posts.id = :id', { id: postId })
      .getOne();

    if (!result) {
      throw new InternalServerErrorException('Post not found.');
    }

    return result;
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post: PostEntity | null = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('Not the post owner.');
    }

    await this.postRepo.remove(post);
  }
}
