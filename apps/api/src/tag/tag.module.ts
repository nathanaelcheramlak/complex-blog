import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, PostEntity, UserEntity])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
