import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @Optional()
  readonly slug?: string;

  @ApiProperty({ required: false, example: 'Updated Title' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @Optional()
  readonly title?: string;

  @ApiProperty({ required: false, example: 'Updated content...' })
  @IsString()
  @MinLength(5)
  @Optional()
  readonly content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Optional()
  readonly thumbnail?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @Optional()
  readonly published?: boolean;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsNumber({}, { each: true })
  @Optional()
  readonly tagIds?: number[];
}
