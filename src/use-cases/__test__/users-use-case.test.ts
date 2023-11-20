import { Users as UsersDomain } from '~/domains/models/users';
import { Users } from '~/use-cases/users';

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
    const model = new MockedUserDomain();
    const payload = {
      fullname: 'Megumi Fushiguro',
      username: 'megumumi',
      password: 'secret',
    };
    const newUser = await Users.createUser(payload, model);

    expect(newUser).toHaveProperty('fullname', payload.fullname);
    expect(newUser).toHaveProperty('username', payload.username);
    expect(newUser).toHaveProperty('id');
    expect(typeof newUser.id).toBe('string');
  });
});
