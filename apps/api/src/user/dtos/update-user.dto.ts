import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User display name',
    maxLength: 255,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'User bio',
    maxLength: 255,
    example: 'Software developer from NYC',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly bio?: string;
}
