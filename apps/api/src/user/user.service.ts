import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
// import { Brackets } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

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
      .getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
