import { ClientError } from '~/commons/errors/client-error';
import { Users as UsersDomain } from '~/domains/models/users';
import { UsersUseCase } from '~/use-cases/users';

describe('Users use case test suite', () => {
  test('Create User test case', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Jhon doe',
          username: 'jhondoe',
        },
      ];

      return {
        async create(payload): Promise<User> {
          const user = {
            id: 'user-xxx',
            fullname: payload.fullname,
            username: payload.username,
          };

          users.push(user);

          return user;
        },
        async isUsernameExist(username) {
          return users.some(user => user.username === username);
        },
      };
    });
    const Users = new UsersUseCase(new MockedUserDomain());
    const payload = {
      fullname: 'Megumi Fushiguro',
      username: 'megumumi',
      password: 'secret',
    };
    const newUser = await Users.createUser(payload);

    expect(newUser).toHaveProperty('fullname', payload.fullname);
    expect(newUser).toHaveProperty('username', payload.username);
    expect(newUser).toHaveProperty('id');
    expect(typeof newUser.id).toBe('string');
  });

  test('Create User test case with unavailable username', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Jhon doe',
          username: 'jhondoe',
        },
      ];

      return {
        async create(payload): Promise<User> {
          const user = {
            id: 'user-xxx',
            fullname: payload.fullname,
            username: payload.username,
          };

          users.push(user);

          return user;
        },
        async isUsernameExist(username) {
          return users.some(user => user.username === username);
        },
      };
    });
    const Users = new UsersUseCase(new MockedUserDomain());
    const payload = {
      fullname: 'Jhon doelan',
      username: 'jhondoe',
      password: 'secret',
    };

    expect(async () => await Users.createUser(payload)).rejects.toThrow(
      ClientError,
    );
  });
});
