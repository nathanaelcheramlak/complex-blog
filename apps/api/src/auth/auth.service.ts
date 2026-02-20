import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { AuthTokenResponse } from 'src/auth/models/api-token-response.interface.ts';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
