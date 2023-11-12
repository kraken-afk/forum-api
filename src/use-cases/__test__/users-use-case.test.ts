import { db } from '@test/helpers/db';
import { randomStr } from '~/commons/libs/random-str';
import { Users as UsersDomain } from '~/domains/models/users';
import { users } from '~/infrastructure/database/schema';
import { UsersRepository } from '~/infrastructure/repository/users-repository';
import { Users } from '~/use-cases/users';

describe('Users use case test suite', () => {
  const model = new UsersDomain(new UsersRepository(db));

  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });

  test('Create User test case', async () => {
    const userPayload = createUserPayload();
    const newUser = await Users.createUser(userPayload, model);

    expect(newUser).toHaveProperty('fullname', userPayload.fullname);
    expect(newUser).toHaveProperty('username', userPayload.username);
    expect(newUser).toHaveProperty('id');
    expect(typeof newUser.id).toBe('string');
  });
});

function createUserPayload(): UserPayload {
  return {
    fullname: 'Jhondoe',
    username: randomStr(7),
    password: 'supersecret',
  };
}
