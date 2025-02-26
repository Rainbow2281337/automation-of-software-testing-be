import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiResponse({
    status: 200,
    description:
      'The user has been successfully registered and authorized. access_token is returned',
  })
  @ApiResponse({
    status: 400,
    description: 'Wrong parameters or user with this email is already exists',
  })
  public register(
    @Body() registerDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'access_token is returned',
  })
  @ApiResponse({
    status: 401,
    description: 'User with provided email and password does not exists',
  })
  public signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto);
  }
}
