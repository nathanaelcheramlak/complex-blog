import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { TagModule } from './tag/tag.module';
import { join } from 'node:path';
import { LikeModule } from './like/like.module';
import { DatabaseModule } from './database/seeder.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbName = configService.get<string>(
          'DATABASE_NAME',
          'database.db',
        );

        // This points to: eg:- ./apps/api/../../complex_blog.db (the root)
        const dbPath = join(__dirname, '..', '..', '..', dbName);
        return {
          type: 'sqlite',
          database: dbPath,
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
    UserModule,
    PostModule,
    CommentModule,
    TagModule,
    LikeModule,
    DatabaseModule,
    AuthModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
