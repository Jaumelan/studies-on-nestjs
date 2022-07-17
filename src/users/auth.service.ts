import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email is already in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }
    //hash the password with a random salt to avoid rainbow table attacks
    const salt = randomBytes(8).toString('hex');

    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hashedPassword.toString('hex');

    //create a new user and save it
    const user = await this.usersService.create(email, result);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, hashedPassword] = user.password.split('.');

    const hashed = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword !== hashed.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
