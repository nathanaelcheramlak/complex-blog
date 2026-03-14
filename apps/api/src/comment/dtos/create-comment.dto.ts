import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly content!: string;
}
