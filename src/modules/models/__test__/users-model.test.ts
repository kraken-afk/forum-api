import { db } from '@test/helpers/db';
import { eq } from 'drizzle-orm';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { Users } from '~/domains/models/users';
import { users } from '~/infrastructure/database/schema';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

const model = new Users(new UsersRepository(db));

describe('Users model test suite', () => {
  beforeEach(async () => {
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(users);
  });

  test('Methods check', () => {
    expect(model).toHaveProperty('createUser');
    expect(model).toHaveProperty('isPasswordAndUsernameMatch');
    expect(model).toHaveProperty('isUsernameExist');
  });

  test('Create user', async () => {
    const payload = createUserPayload();
    const user = await model.createUser(payload);

    expect(
      (await db.select().from(users).where(eq(users.id, user.id))).length,
    ).toEqual(1);
  });

  test('Check password and username', async () => {
    const payload = createUserPayload();

    await insertUser(payload);

    expect(
      await model.isPasswordAndUsernameMatch(
        payload.username,
        payload.password,
      ),
    ).toBeTruthy();
    expect(
      await model.isPasswordAndUsernameMatch(payload.username, 'wrongpassword'),
    ).toBeFalsy();
  });

  test('Check username availability', async () => {
    const payload = createUserPayload();
    const user = await insertUser(payload);

    expect(await model.isUsernameExist(user.username)).toBeTruthy();
    expect(await model.isUsernameExist('xxx')).toBeFalsy();
  });
});

async function insertUser(payload: UserPayload) {
  return await model.createUser(payload);
}

function createUserPayload(): UserPayload {
  return {
    fullname: 'Jhon doe',
    username: randomStr(7),
    password: 'supersecret',
  };
}
