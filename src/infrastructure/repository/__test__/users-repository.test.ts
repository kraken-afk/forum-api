import { db } from '@test/helpers/db';
import { eq } from 'drizzle-orm';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

const model = new UsersRepository(db);

describe('Users repository test suite', () => {
  beforeEach(async () => {
    await db.delete(replies);
    await db.delete(comments);
    await db.delete(threads);
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(replies);
    await db.delete(comments);
    await db.delete(threads);
    await db.delete(users);
  });

  test('Methods check', () => {
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('delete');
    expect(model).toHaveProperty('isPasswordAndUsernameMatch');
    expect(model).toHaveProperty('isUsernameExist');
  });

  test('Create user', async () => {
    const payload = createUserPayload();
    const user = await model.create(payload);

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

  test('Select user by username', async () => {
    const payload = createUserPayload();
    const { username, fullname, id } = await insertUser(payload);
    const user = await model.select(username);

    expect(user).haveOwnProperty('fullname', fullname);
    expect(user).haveOwnProperty('username', username);
    expect(user).haveOwnProperty('id', id);
  });

  test('Delete user', async () => {
    const payload = createUserPayload();
    const { id } = await insertUser(payload);

    await model.delete(id);

    expect(await model.select(id)).toBeFalsy();
  });
});

async function insertUser(payload: UserPayload) {
  return await model.create(payload);
}

function createUserPayload(): UserPayload {
  return {
    fullname: 'Jhon doe',
    username: randomStr(7),
    password: 'supersecret',
  };
}
