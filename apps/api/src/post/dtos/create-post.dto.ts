import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
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
  @IsOptional()
  @IsString()
  readonly thumbnail?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  readonly published?: boolean;

  @ApiProperty({ example: [1, 2], required: false })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly tagIds?: number[];
}
