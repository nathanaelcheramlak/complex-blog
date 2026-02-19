import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { SeederCommander } from 'src/database/seeder.command';
import { SeederService } from 'src/database/seeder.service';
import { LikeEntity } from 'src/like/entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PostEntity,
      CommentEntity,
      TagEntity,
      LikeEntity,
    ]),
  ],
  providers: [SeederService, SeederCommander],
  exports: [SeederService],
})
export class DatabaseModule {}
