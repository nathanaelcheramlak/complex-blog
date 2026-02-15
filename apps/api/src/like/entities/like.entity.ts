import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// many to many relationship b/n posts and users
@Entity({ name: 'likes' })
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'number' })
  userId!: number;

  @Column({ type: 'number' })
  postId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.likes, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.likes, {
    onDelete: 'CASCADE',
  })
  post: PostEntity;
}
