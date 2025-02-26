import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/shared/guards/auth/auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Wrong parameters or user with this email is already exists',
  })
  @Post()
  public async createUser(
    @Body() createUserRequest: CreateUserDto,
  ): Promise<User> {
    const isUserExists = await this.userService.checkIfUserExists(
      createUserRequest.email,
    );
    if (isUserExists) {
      throw new BadRequestException({
        code: '0001',
        message: 'User with the same email is already exists',
      });
    }

    return this.userService.createUser(createUserRequest);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() updateParams: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.updateUser(id, updateParams);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  public async getUserList(): Promise<User[]> {
    return this.userService.getUserList({});
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  public async deleteUser(@Param('id') id: string): Promise<unknown> {
    return this.userService.deleteUser(id);
  }
}
