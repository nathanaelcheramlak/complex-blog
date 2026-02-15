import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/comment/entities/comment.entity';

@Module({ imports: [TypeOrmModule.forFeature([CommentEntity])] })
export class CommentModule {}
