import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/entities/post.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, UserEntity, TagEntity]),
    AuthModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
