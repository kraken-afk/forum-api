import { db } from '@test/helpers/db';
import { eq } from 'drizzle-orm';
import { randomStr } from '~/commons/libs/random-str';
import { authentications } from '~/infrastructure/database/schema';
import { AuthenticationsRepository } from '~/infrastructure/repository/authentications-repository';

const model = new AuthenticationsRepository(db);

describe('Authentication repository test suite', () => {
  beforeEach(async () => {
    await db.delete(authentications);
  });

  afterAll(done => {
    db.delete(authentications).then(() => done());
  });

  test('Chech methods', () => {
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

    expect((await db.select().from(authentications))[0]).toHaveProperty(
      'token',
      accessToken,
    );
    expect((await db.select().from(authentications))[0]).toHaveProperty(
      'refreshToken',
      refreshToken,
    );
  });

  test('Update Token', async () => {
    const { refreshToken } = await insert();
    const newToken = randomStr();

    await model.updateToken(newToken, refreshToken);

    expect(
      (
        await db
          .select()
          .from(authentications)
          .where(eq(authentications.token, newToken))
      )[0],
    ).toHaveProperty('token', newToken);
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

    expect((await db.select().from(authentications)).length).toEqual(0);
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
