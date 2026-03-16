import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { CreateTagDto } from 'src/tag/dtos/create-tag.dto';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getTags(): Promise<TagEntity[]> {
    const tags: TagEntity[] = await this.tagRepo.find();

    return tags;
  }

  async getTagById(tagId: number): Promise<TagEntity> {
    const tag: TagEntity | null = await this.tagRepo.findOneBy({ id: tagId });

    if (!tag) {
      throw new NotFoundException('Tag not found.');
    }

    return tag;
  }

  async createTag(userId: number, input: CreateTagDto): Promise<TagEntity> {
    const existingTag: TagEntity | null = await this.tagRepo.findOneBy({
      name: input.name,
    });

    if (existingTag) {
      throw new ConflictException('Tag already exists.');
    }

    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    const post: PostEntity | null = await this.postRepo.findOneBy({
      id: input.postId,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const tag: TagEntity = this.tagRepo.create({
      name: input.name,
    });
    tag.posts = [post];

    await this.tagRepo.save(tag);

    const createdTag: TagEntity | null = await this.tagRepo
      .createQueryBuilder('tags')
      .leftJoin('tags.posts', 'posts')
      .addSelect(['posts.id', 'posts.title', 'posts.slug'])
      .where('tags.id = :id', { id: tag.id })
      .getOne();

    if (!createdTag) {
      throw new NotFoundException('Tag not found.');
    }

    return createdTag;
  }

  // update and delete will be implemented when admin is created
}
