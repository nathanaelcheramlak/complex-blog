import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly slug?: string;

  @ApiProperty({ required: false, example: 'Updated Title' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly title?: string;

  @ApiProperty({ required: false, example: 'Updated content...' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  readonly content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly thumbnail?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  readonly published?: boolean;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly tagIds?: number[];
}
