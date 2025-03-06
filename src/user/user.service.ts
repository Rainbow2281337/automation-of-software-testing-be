import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryAbstract } from 'src/shared/db-tools/repository-abstract';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService extends RepositoryAbstract<User, UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  /**
   * Takes a password as a param and encrypts it using base64
   *
   * @param password - password to be encrypted
   * @returns - encrypted password
   * @memberof UserService
   */
  private encryptPassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  /**
   * Takes an email as params and checks if the user exists
   *
   * @param email - email of the user
   * @returns - boolean value indicating if the user exists
   * @memberof UserService
   */
  public async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.findOne({ email });

    return !!user;
  }

  /**
   * Takes a user data as a param and creates a new user
   *
   * @param userData - data of the user to be created
   * @returns - created user
   * @memberof UserService
   */
  public createUser(userData: CreateUserDto): Promise<User> {
    const data = {
      ...userData,
      password: this.encryptPassword(userData.password),
    } as User;

    return this.create(data);
  }

  /**
   * Takes an email and password as params and returns the user data.
   * If the user is not found, it throws an BadRequestException with a message 'User not found'
   *
   * @param email - email of the user
   * @param password - password of the user
   * @returns - user data
   * @memberof UserService
   */
  public async getUserData(email: string, password: string): Promise<User> {
    const user = await this.findOne({
      email,
      password: this.encryptPassword(password),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  /**
   * Takes an id as a param, checks if user with this id exists. If yes, returns the user data.
   * If not, throws a NotFoundException with a message 'User with provided id: ${id} not found'
   *
   * @param id - id of the user
   * @returns - user data
   * @memberof UserService
   */
  public async getUserById(id: string): Promise<User | null> {
    const user = await this.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with provided id: ${id} not found`);
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new NotFoundException(`User with provided id: ${email} not found`);
    }

    return user;
  }

  /**
   * Takes a filter as a param and returns a list of users based on the filter if users are found
   *
   * @param filters - filter to be applied
   * @returns - list of users ?? []
   * @memberof UserService
   */
  public async getUserList(filters: FilterQuery<User>): Promise<User[]> {
    const users = await this.findMultiple(filters);

    if (users?.length > 0) {
      return users;
    }
    return [];
  }

  /**
   * Takes an id and data as params and updates the user data
   *
   * @param id - id of the user
   * @param data - data to be updated
   * @returns - updated user
   * @memberof UserService
   */
  public async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<User | null> {
    if (data.password) {
      data.password = this.encryptPassword(data.password);
    }
    return this.update({ _id: id }, data);
  }

  /**
   * Takes an id as a param and deletes the user
   *
   * @param id - id of the user
   * @returns - deleted user
   * @memberof UserService
   */
  public async deleteUser(id: string): Promise<unknown> {
    return this.remove({ _id: id });
  }
}
