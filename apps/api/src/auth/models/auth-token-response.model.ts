import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 1, description: 'User ID' })
  readonly id!: number;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  readonly name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  readonly email!: string;

  @ApiProperty({
    example: 'Software developer',
    description: 'User bio',
    nullable: true,
  })
  readonly bio!: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
    nullable: true,
  })
  readonly avatar!: string | null;
}

export class AuthTokenResponse {
  @ApiProperty({ description: 'JWT access token' })
  readonly accessToken!: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse,
  })
  readonly user!: UserResponse;
}
