import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'javascript',
    description: 'Tag name (3-50 characters)',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @ApiProperty({ example: 1, description: 'Post ID to associate with tag' })
  @IsInt()
  @IsPositive()
  @Max(250)
  postId!: number;
}
