import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.postRepo.find();
  }
}
