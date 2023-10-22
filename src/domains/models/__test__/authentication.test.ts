import { db } from '@test/helpers/db';
import { describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { AuthenticationMock } from '~/domains/models/__test__/mock/authentications-repository-mock';
import { Authentications } from '~/domains/models/authentications';

// Mock class won't access database
const mock = new AuthenticationMock(db);
const model = new Authentications(mock);

describe('Authentication domain test suite', () => {
  test('Check methods', () => {
    expect(model).toHaveProperty('isRefreshTokenExist');
    expect(model).toHaveProperty('isAccessTokenExist');
    expect(model).toHaveProperty('insert');
    expect(model).toHaveProperty('deleteToken');
    expect(model).toHaveProperty('updateToken');
  });

  test('Insert Token', async () => {
    const accessToken = randomStr();
    const refreshToken = randomStr();

    await model.insert(accessToken, refreshToken);

    expect(await mock.token).toHaveProperty('accessToken', accessToken);
    expect(await mock.token).toHaveProperty('refreshToken', refreshToken);
  });

  test('Update Token', async () => {
    const { refreshToken } = await insert();
    const newToken = randomStr();

    await model.updateToken(newToken, refreshToken);

    expect(mock.token).toHaveProperty('accessToken', newToken);
  });

  test('Is refresh token exist', async () => {
    const { refreshToken } = await insert();

    expect(await model.isRefreshTokenExist(refreshToken)).toBeTruthy();
  });

  test('Is access token exist', async () => {
    const { accessToken } = await insert();

    expect(await model.isAccessTokenExist(accessToken)).toBeTruthy();
  });

  test('Delete token', async () => {
    const { refreshToken } = await insert();

    await model.deleteToken(refreshToken);

    expect(mock.token.accessToken).toEqual('');
    expect(mock.token.refreshToken).toEqual('');
  });
});

async function insert(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const accessToken = randomStr();
  const refreshToken = randomStr();

  await model.insert(accessToken, refreshToken);

  return { accessToken, refreshToken };
}
