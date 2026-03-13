import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @Optional()
  readonly slug?: string;

  @ApiProperty({ example: 'My Post Title' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly title!: string;

  @ApiProperty({ example: 'Post content here...' })
  @IsString()
  @MinLength(5)
  readonly content!: string;

  @ApiProperty({ required: false })
  @IsString()
  @Optional()
  readonly thumbnail?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @Optional()
  readonly published?: boolean;

  @ApiProperty({ example: [1, 2], required: false })
  @IsNumber({}, { each: true })
  @Optional()
  readonly tagIds?: number[];
}
