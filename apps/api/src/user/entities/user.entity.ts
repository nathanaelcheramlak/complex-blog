import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  bio!: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string | null;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  posts!: PostEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.user)
  comments!: CommentEntity[];

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.user)
  likes: LikeEntity[];
}
