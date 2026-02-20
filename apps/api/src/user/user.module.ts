import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from './user.service';

@Module({ imports: [TypeOrmModule.forFeature([UserEntity])], providers: [UserService] })
export class UserModule {}
