import { CommentEntity } from 'src/comment/entities/comment.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  slug!: string | null;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'boolean' })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: UserEntity;

  @ManyToMany(() => TagEntity, (tag: TagEntity) => tag.posts, {
    onDelete: 'RESTRICT',
  })
  tags!: TagEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post)
  comments!: CommentEntity[];

  @OneToMany(() => LikeEntity, (like: LikeEntity) => like.post)
  likes: LikeEntity[];
}
