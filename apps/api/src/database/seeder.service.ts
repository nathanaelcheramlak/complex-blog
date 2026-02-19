import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { LikeEntity } from 'src/like/entities/like.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,

    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,

    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,

    @InjectRepository(LikeEntity)
    private likeRepo: Repository<LikeEntity>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedTags();
    await this.seedPosts();
    await this.seedComments();
    await this.seedLikes();

    console.log('----- seeding completed! -----');
  }

  private async seedUsers(count = 10): Promise<UserEntity[]> {
    const users: UserEntity[] = [];
    for (let i = 0; i < count; i++) {
      const user = this.userRepo.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        password: faker.internet.password(),
      });

      users.push(user);
    }

    return this.userRepo.save(users);
  }

  private async seedTags(count = 8): Promise<TagEntity[]> {
    const tags: TagEntity[] = [];
    const uniqueNames = new Set<string>();

    while (uniqueNames.size < count) {
      uniqueNames.add(faker.word.sample());
    }

    for (const name of uniqueNames) {
      tags.push(this.tagRepo.create({ name }));
    }

    return this.tagRepo.save(tags);
  }

  private async seedPosts(count = 40): Promise<PostEntity[]> {
    const users = await this.userRepo.find();
    const tags = await this.tagRepo.find();
    const posts: PostEntity[] = [];

    for (let i = 0; i < count; i++) {
      const post = this.postRepo.create({
        title: faker.lorem.sentence(),
        slug: faker.helpers.slugify(faker.lorem.sentence()),
        content: faker.lorem.paragraph(3),
        thumbnail: faker.image.url(),
        published: faker.datatype.boolean(0.7),
        user: faker.helpers.arrayElement(users),
        tags: faker.helpers.arrayElements(tags, { min: 1, max: 3 }),
      });

      posts.push(post);
    }

    return this.postRepo.save(posts);
  }

  private async seedComments(count = 70): Promise<CommentEntity[]> {
    const users = await this.userRepo.find();
    const posts = await this.postRepo.find();
    const comments: CommentEntity[] = [];

    for (let i = 0; i < count; i++) {
      const comment = this.commentRepo.create({
        content: faker.lorem.sentence(),
        post: faker.helpers.arrayElement(posts),
        user: faker.helpers.arrayElement(users),
      });

      comments.push(comment);
    }

    return this.commentRepo.save(comments);
  }

  private async seedLikes(count = 150): Promise<LikeEntity[]> {
    const users = await this.userRepo.find();
    const posts = await this.postRepo.find();
    const likes: LikeEntity[] = [];

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users);
      const post = faker.helpers.arrayElement(posts);

      // check to not duplicate likes
      const exists = await this.likeRepo.findOne({
        where: { userId: user.id, postId: post.id },
      });

      if (exists) continue;

      const like = this.likeRepo.create({
        userId: user.id,
        postId: post.id,
        user,
        post,
      });

      likes.push(like);
    }

    return this.likeRepo.save(likes);
  }
}
