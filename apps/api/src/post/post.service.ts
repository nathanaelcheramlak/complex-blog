import {
  ConflictException,
  ForbiddenException,
  Injectable,
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
    private readonly userRepo: Repository<UserEntity>,
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  async createPost(userId: number, input: CreatePostDto): Promise<PostEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    const existingPost: PostEntity | null = await this.postRepo.findOne({
      where: { title: input.title },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

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

    return this.postRepo.save(post);
  }

  async getPostById(postId: number): Promise<PostEntity> {
    const post: PostEntity | null = await this.postRepo.findOne({
      where: { id: postId },
    });

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

    const query = this.postRepo.createQueryBuilder('posts');

    if (input.tag) {
      const tags = input.tag.split(',');
      query
        .innerJoinAndSelect('posts.tags', 'tag')
        .where('tag.name IN (:...tags)', { tags: tags });
    }

    // different ordering will be implemented later

    const [posts, total]: [PostEntity[], number] = await query
      .skip(skip)
      .limit(limit)
      .getManyAndCount();

    return {
      data: posts,
      meta: createPaginationMeta(total, page, limit),
    };
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

    return this.postRepo.save(updatedPost);
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
