import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  password: string;

  @ApiProperty()
  userName: string;
}
