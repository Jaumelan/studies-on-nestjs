import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'name@mail.com',
          password: 'password',
        } as User);
      },

      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },

      /*      remove: () => {},
      update: () => {}, */
    };

    authServiceMock = {
      /* signup: () => {}, */

      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindAllUsers should return a list of users with a given email', async () => {
    const users = await controller.findAllUsers('name@mail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('name@mail.com');
  });

  it('FindUser should return a user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('FindUser should throw an error if user is not found', async () => {
    usersServiceMock.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('Signin updates session object and returns user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'name@mail.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
