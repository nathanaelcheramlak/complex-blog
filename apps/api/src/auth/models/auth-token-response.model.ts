import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponse {
  @ApiProperty({ description: 'JWT access token' })
  readonly accessToken!: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      bio: null,
      avatar: null,
    },
  })
  readonly user!: {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly bio: string | null;
    readonly avatar: string | null;
  };
}
