import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from 'src/comment/dtos/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dtos/update-comment.dto';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import {
  CursorPaginatedRespose,
  decodeCursor,
  encodeCursor,
} from 'src/common/dto/cursor-pagination.dto';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async getcommentsByPost(
    postId: number,
    input: {
      readonly cursor?: string;
      readonly limit?: number;
    },
  ): Promise<CursorPaginatedRespose<CommentEntity>> {
    const limit = input.limit ?? 5;

    const queryBuilder = this.commentRepo
      .createQueryBuilder('comments')
      .where('comments.postId = :postId', { postId })
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .orderBy('comments.createdAt', 'DESC')
      .addOrderBy('comments.id', 'DESC')
      .take(limit + 1); // fetch extra to check hasMore

    if (input.cursor) {
      const decoded = decodeCursor(input.cursor);
      if (decoded) {
        queryBuilder.andWhere(
          '(comments.createdAt < :cursorDate OR (comments.createdAt = :cursorDate AND comments.id <= :cursorId))',
          {
            cursorDate: decoded.createdAt,
            cursorId: decoded.id,
          },
        );
      }
    }

    const comments: CommentEntity[] = await queryBuilder.getMany();

    const hasMore = comments.length > limit;
    const nextCursor = hasMore
      ? encodeCursor(
          comments[comments.length - 1].createdAt,
          comments[comments.length - 1].id,
        )
      : null;

    if (hasMore) comments.pop(); // remove the extra one

    return {
      data: comments,
      meta: { limit, hasMore, nextCursor, prevCursor: input.cursor ?? null },
    };
  }

  async getCommentById(commentId: number): Promise<CommentEntity> {
    const comment: CommentEntity | null = await this.commentRepo
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .leftJoin('comments.post', 'post')
      .addSelect(['post.id', 'post.title'])
      .where('comments.id = :id', { id: commentId })
      .getOne();

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    return comment;
  }

  async createComment(
    postId: number,
    userId: number,
    input: CreateCommentDto,
  ): Promise<CommentEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    const post: PostEntity | null = await this.postRepo.findOneBy({
      id: postId,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const comment: CommentEntity = this.commentRepo.create({
      ...input,
      user,
      post,
    });

    await this.commentRepo.save(comment);

    const createdComment: CommentEntity | null = await this.commentRepo
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .leftJoin('comments.post', 'post')
      .addSelect(['post.id', 'post.title'])
      .where('comments.id = :id', { id: comment.id })
      .getOne();

    if (!createdComment) {
      throw new NotFoundException('Comment not found.');
    }

    return createdComment;
  }

  async updateComment(
    userId: number,
    commentId: number,
    input: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    const comment: CommentEntity | null = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('Not the comment owner.');
    }

    const updatedComment: CommentEntity = this.commentRepo.merge(comment, {
      ...input,
    });

    await this.commentRepo.save(updatedComment);

    const result: CommentEntity | null = await this.commentRepo
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .leftJoin('comments.post', 'post')
      .addSelect(['post.id', 'post.title'])
      .where('comments.id = :id', { id: commentId })
      .getOne();

    if (!result) {
      throw new NotFoundException('Comment not found.');
    }

    return result;
  }

  async deleteComment(userId: number, commentId: number): Promise<void> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    const comment: CommentEntity | null = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('Not the comment owner.');
    }

    await this.commentRepo.remove(comment);
  }
}
