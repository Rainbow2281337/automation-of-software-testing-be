import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;
}
