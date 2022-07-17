import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let UsersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    //create a mock of the users service
    const users: User[] = [];
    UsersServiceMock = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: UsersServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup('email@mail.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.'); //split the password into salt and hash with a $ to failure
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an existing email', async () => {
    await authService.signup('email@mail.com', 'password');
    await expect(
      authService.signup('email@mail.com', 'password'),
    ).rejects.toThrow('Email already in use');
  });

  it('throws an error if user signs in with an invalid email', async () => {
    await expect(
      authService.signin('email@mail.com', 'password'),
    ).rejects.toThrow('User not found');
  });

  it('throws an error if user signs in with an invalid password', async () => {
    expect.assertions(1);
    await authService.signup('email@mail.com', 'password');

    await expect(
      authService.signin('email@mail.com', 'wrongPassword'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('returns the user if user signs in with a valid email and password', async () => {
    //expect.assertions(1);
    await authService.signup('email@mail.com', 'password');

    const user = await authService.signin('email@mail.com', 'password');
    expect(user).toBeDefined();
  });
});
