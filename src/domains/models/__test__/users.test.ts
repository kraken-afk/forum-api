import { Users } from '~/domains/models/users';
import type { IUsers } from '~/infrastructure/contracts/T-users';

describe('Users repository test suite', () => {
  test('Methods check', () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => ({}));
    const model = new Users(new MockedUserRepository());

    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('delete');
    expect(model).toHaveProperty('isPasswordAndUsernameMatch');
    expect(model).toHaveProperty('isUsernameExist');
  });

  test('Create user', async () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => ({
      async create(payload): Promise<User> {
        return {
          id: 'xxx',
          fullname: payload.fullname,
          username: payload.username,
        };
      },
    }));
    const model = new Users(new MockedUserRepository());
    const payload = {
      fullname: 'Jhon doe',
      username: 'jhnd11',
      password: 'supersecret',
    };
    const user = await model.create(payload);

    expect(user).toHaveProperty('id', 'xxx');
    expect(user).toHaveProperty('fullname', payload.fullname);
    expect(user).toHaveProperty('username', payload.username);
  });

  test('Check password and username', async () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => ({
      async isPasswordAndUsernameMatch(username, password): Promise<boolean> {
        const users = {
          username: 'Romeo',
          password: 'supersecret',
        };

        return username === users.username && password === users.password;
      },
    }));
    const model = new Users(new MockedUserRepository());

    expect(
      await model.isPasswordAndUsernameMatch('Romeo', 'supersecret'),
    ).toBeTruthy();
    expect(
      await model.isPasswordAndUsernameMatch('Romeo', 'wrongpassword'),
    ).toBeFalsy();
  });

  test('Check username availability', async () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => ({
      async isUsernameExist(username): Promise<boolean> {
        const users = ['Itadori', 'Gojo satouru', 'Sukuna'];

        return users.includes(username);
      },
    }));
    const model = new Users(new MockedUserRepository());

    expect(await model.isUsernameExist('Sukuna')).toBeTruthy();
    expect(await model.isUsernameExist('xxx')).toBeFalsy();
  });

  test('Select user by username', async () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => ({
      async select(username): Promise<User | undefined> {
        const users: User[] = [
          {
            fullname: 'Jhon doe',
            id: 'jdh1',
            username: 'jhondoe',
          },
          {
            fullname: 'Toji Fushiguro',
            id: 'tji11',
            username: 'toji',
          },
        ];

        return users.find(user => user.username === username);
      },
    }));
    const model = new Users(new MockedUserRepository());
    const userThatExist = await model.select('toji');

    expect(userThatExist).toHaveProperty('fullname', 'Toji Fushiguro');
    expect(userThatExist).toHaveProperty('username', 'toji');
    expect(userThatExist).toHaveProperty('id', 'tji11');

    const userDidntExist = await model.select('kaori');
    expect(userDidntExist).toBe(undefined);
  });

  test('Delete user', async () => {
    const MockedUserRepository = <jest.Mock<IUsers>>jest.fn(() => {
      let users: User[] = [
        {
          fullname: 'Jhon doe',
          id: 'jdh1',
          username: 'jhondoe',
        },
        {
          fullname: 'Toji Fushiguro',
          id: 'tji11',
          username: 'toji',
        },
      ];
      return {
        async delete(id): Promise<void> {
          users = users.filter(user => user.id !== id);
        },
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });
    const model = new Users(new MockedUserRepository());

    await model.delete('jdh1');

    expect(await model.select('jdh1')).toBeFalsy();
  });
});
