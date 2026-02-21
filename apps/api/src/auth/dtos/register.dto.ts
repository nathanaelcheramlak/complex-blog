import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MaxLength(120)
  readonly name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @MaxLength(120)
  readonly email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (8-72 characters)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  readonly password!: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Optional avatar URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}
