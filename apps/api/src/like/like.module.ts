import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from 'src/like/entities/like.entity';
import { LikeService } from './like.service';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, PostEntity, UserEntity])],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
