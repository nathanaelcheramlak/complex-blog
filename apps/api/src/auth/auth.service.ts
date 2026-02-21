import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { AuthTokenResponse } from 'src/auth/models/auth-token-response.model';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

const passwordSaltRounds: number = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto): Promise<AuthTokenResponse> {
    const existingUser: UserEntity | null = await this.userService.findByEmail(
      input.email,
    );

    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(
      input.password,
      passwordSaltRounds,
    );

    // handle image upload here later
    // ---
    const user: UserEntity = await this.userService.createUser({
      name: input.name,
      email: input.email,
      hashedPassword,
      // will be hadled after image upload is done
      avatarUrl: '',
    });

    return this.createTokenResponse(user);
  }

  async login(input: LoginDto): Promise<AuthTokenResponse> {
    const user: UserEntity | null = await this.userService.findByIdentifier(
      input.identifier.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.createTokenResponse(user);
  }

  private createTokenResponse(user: UserEntity): AuthTokenResponse {
    const accessToken: string = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user: this.mapUser(user) };
  }

  private mapUser(user: UserEntity): AuthTokenResponse['user'] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
    };
  }
}
