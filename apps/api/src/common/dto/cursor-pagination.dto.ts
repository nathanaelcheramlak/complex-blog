import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CursorPaginationDto {
  @ApiPropertyOptional({
    description: 'Cursor for pagination (format: ISO_DATE_ID)',
    example: '2026-03-13T20:00:00.000Z_42',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z_\d+$/, {
    message:
      'Invalid cursor format. Expected: ISO_DATE_ID (e.g., 2026-03-13T20:00:00.000Z_42)',
  })
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    minimum: 1,
    maximum: 15,
    default: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  limit?: number = 5;
}

export class CursorPaginationMeta {
  @ApiProperty({ description: 'Number of items returned' })
  limit!: number;

  @ApiProperty({ description: 'Whether there are more items' })
  hasMore!: boolean;

  @ApiProperty({ description: 'Next cursor for pagination', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({
    description: 'Previous cursor for pagination',
    nullable: true,
  })
  prevCursor!: string | null;
}

export interface CursorPaginatedRespose<T> {
  data: T[];
  meta: CursorPaginationMeta;
}

export function encodeCursor(createdAt: Date, id: number): string {
  return `${createdAt.toISOString()}_${id}`;
}

export function decodeCursor(
  cursor: string,
): { createdAt: Date; id: number } | null {
  const [dateStr, idStr] = cursor.split('_');
  if (!dateStr || !idStr) {
    return null;
  }

  return { createdAt: new Date(dateStr), id: parseInt(idStr, 10) };
}
