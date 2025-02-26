import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';

export interface AccessTokenInfo {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Authenticates the user and returns access token
   *
   * @param user - user data
   * @returns - access token
   * @memberof AuthService
   */
  private async authenticate(user: User): Promise<AccessTokenInfo> {
    const payload: Omit<User, 'password'> = {
      email: user.email,
      userName: user.userName,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
    };
  }

  /**
   * Check if user exists. If user exists, throw an BadRequestException.
   * If user does not exist, create a new user and return access token
   *
   * @param registrationData - user registration data
   * @returns - access token
   * @memberof AuthService
   */
  async register(registrationData: CreateUserDto): Promise<AccessTokenInfo> {
    const checkIfUserExists = await this.userService.checkIfUserExists(
      registrationData.email,
    );

    if (checkIfUserExists) {
      throw new BadRequestException({
        code: '0001',
        message: 'User with the same email is already exists',
      });
    }
    const newUser = await this.userService.createUser({ ...registrationData });
    return this.authenticate(newUser);
  }

  /**
   * Checks if user credential are valid. If yes, signs in the user and return access token.
   * If no, throws an BadRequestException
   *
   * @param signInData - user sign in data
   * @returns - access token
   * @memberof AuthService
   */
  async signIn(signInData: SignInDto): Promise<AccessTokenInfo> {
    const user = await this.userService.getUserData(
      signInData.email,
      signInData.password,
    );
    if (!user) {
      throw new BadRequestException({
        code: '0002',
        message: 'Invalid email or password',
      });
    }
    return this.authenticate(user);
  }
}
