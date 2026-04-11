import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('follows')
@Unique(['follower', 'following'])
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('idx_follows_follower')
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower!: UserEntity;

  @Index('idx_follows_following')
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
