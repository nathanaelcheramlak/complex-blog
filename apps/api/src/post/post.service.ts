import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createPaginationMeta,
  PaginatedResponse,
} from 'src/common/dto/pagination.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

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
}
