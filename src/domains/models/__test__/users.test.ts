import { db } from '@test/helpers/db';
import { describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { UsersMock } from '~/domains/models/__test__/mock/users-repository-mock';
import { Users } from '~/domains/models/users';

// Mock class won't access database
const mock = new UsersMock(db);
const model = new Users(mock);

describe('Users repository test suite', () => {
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

    expect(mock.user.id).toEqual(user.id);
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
