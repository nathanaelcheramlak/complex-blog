import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from 'src/follow/entities/follow.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity, UserEntity])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
