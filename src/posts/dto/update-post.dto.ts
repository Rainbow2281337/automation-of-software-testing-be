import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsOptional()
  content: string;
}
