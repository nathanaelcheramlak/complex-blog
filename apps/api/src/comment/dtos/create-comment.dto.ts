import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly content!: string;

  @ApiProperty({ example: 1, description: 'Post ID to associate with tag' })
  @IsInt()
  @IsPositive()
  readonly postId!: number;
}
