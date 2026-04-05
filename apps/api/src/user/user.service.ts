import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
// import { Brackets } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createUser(input: {
    readonly name: string;
    readonly email: string;
    readonly hashedPassword: string;
    readonly avatarUrl: string | null;
  }): Promise<UserEntity> {
    const user: UserEntity = this.userRepo.create({
      name: input.name,
      email: input.email,
      password: input.hashedPassword,
      avatar: input.avatarUrl,
    });

    return this.userRepo.save(user);
  }

  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    // Better use table indexing with SQLite built-in collation called  'NOCASE'
    // performance boost from O(n) to O(log n)
    // But NOCASE is not supported in SQLite
    /*    return (
     *      this.userRepo
     *        .createQueryBuilder('user')
     *        // No more LOWER() needed! SQLite handles it.
     *        .where('user.email = :identifier', { identifier })
     *        .orWhere('user.name = :identifier', { identifier })
     *        .getOne()
     *    );
     *
     *  To expand the query to contain also 'andWhere' clause with out conflicts and complextion
     *
     *return this.userRepo
     * .createQueryBuilder('users')
     *.where(
     *        new Brackets((qb) => {
     *          qb.where('LOWER(users.email) = LOWER(:identifier)', {
     *            identifier,
     *          }).orWhere('LOWER(users.name) = LOWER(:identifier)', { identifier });
     *        }),
     *      )
     *      .andWhere('user.isActive = :isActive', { isActive: true })
     *      .getOne();
     */
    // Used to retrive user based on identifier: infefficent if the user table grows b/c of LOWER()
    return this.userRepo
      .createQueryBuilder('users')
      .where('LOWER(users.email) = LOWER(:identifier)', { identifier })
      .orWhere('LOWER(users.name) = LOWER(:identifier)', { identifier })
      .addSelect(['users.password'])
      .getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<UserEntity> {
    const user: UserEntity | null = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    return user;
  }

  async findByIdForAuth(userId: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: { id: userId },
      select: [
        'id',
        'bio',
        'name',
        'email',
        'password',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async updateUser(userId: number, input: UpdateUserDto): Promise<UserEntity> {
    const user: UserEntity | null = await this.userRepo.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('Invlid token.');
    }

    const updatedUser: UserEntity = this.userRepo.merge(user, { ...input });

    await this.userRepo.save(updatedUser);

    // avatar update later

    const result: UserEntity | null = await this.userRepo
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.bio', 'user.avatar'])
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!result) {
      throw new InternalServerErrorException('User not found.');
    }

    return result;
  }
}
