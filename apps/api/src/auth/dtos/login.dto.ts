import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email or name.',
    example: 'john.doe@example.com',
  })
  @IsString()
  @MaxLength(160)
  identifier!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @MinLength(4)
  @MaxLength(72)
  password!: string;
}
