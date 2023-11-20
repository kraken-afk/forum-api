import { Authentications } from '~/domains/models/authentications';
import { IAuthentications } from '~/infrastructure/contracts/T-authentications';

describe('Authentication domain test suite', () => {
  test('Check methods', () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>(
      jest.fn(() => ({}))
    );
    const model = new Authentications(new MockedAuthenticationRepository());

    expect(model).toHaveProperty('isRefreshTokenExist');
    expect(model).toHaveProperty('isAccessTokenExist');
    expect(model).toHaveProperty('insert');
    expect(model).toHaveProperty('deleteToken');
    expect(model).toHaveProperty('updateToken');
  });

  test('Insert Token', async () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>jest.fn(
      () => ({
        async insert(accessToken, refreshToken): Promise<Auth> {
          return {
            accessToken,
            refreshToken,
          };
        },
      }),
    );
    const model = new Authentications(new MockedAuthenticationRepository());
    const auth = await model.insert('access_token', 'refresh_token');

    expect(auth).toHaveProperty('accessToken', 'access_token');
    expect(auth).toHaveProperty('refreshToken', 'refresh_token');
  });

  test('Update Token', async () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>jest.fn(
      () => {
        const auth: Auth[] = [
          {
            accessToken: 'access_token_1',
            refreshToken: 'refresh_token_1',
          },
        ];

        return {
          async updateToken(newToken, refreshToken) {
            const index = auth.findIndex(a => a.refreshToken === refreshToken);

            if (index === -1) throw new Error("token doesn't exist");

            auth[index].accessToken = newToken;

            return { accessToken: newToken };
          },
        };
      },
    );
    const model = new Authentications(new MockedAuthenticationRepository());
    const auth = await model.updateToken('new token', 'refresh_token_1');

    expect(auth).toHaveProperty('accessToken', 'new token');
  });

  test('Is refresh token exist', async () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>jest.fn(
      () => {
        const auth: Auth[] = [
          {
            accessToken: 'access_token_1',
            refreshToken: 'refresh_token_1',
          },
        ];

        return {
          async isRefreshTokenExist(refreshToken): Promise<boolean> {
            return auth.some(a => a.refreshToken === refreshToken);
          },
        };
      },
    );
    const model = new Authentications(new MockedAuthenticationRepository());

    expect(await model.isRefreshTokenExist('refresh_token_1')).toBeTruthy();
    expect(await model.isRefreshTokenExist('refresh_token_2')).toBeFalsy();
  });

  test('Is access token exist', async () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>jest.fn(
      () => {
        const auth: Auth[] = [
          {
            accessToken: 'access_token_1',
            refreshToken: 'refresh_token_1',
          },
        ];

        return {
          async isAccessTokenExist(accessToken): Promise<boolean> {
            return auth.some(a => a.accessToken === accessToken);
          },
        };
      },
    );
    const model = new Authentications(new MockedAuthenticationRepository());

    expect(await model.isAccessTokenExist('access_token_1')).toBeTruthy();
    expect(await model.isAccessTokenExist('access_token_2')).toBeFalsy();
  });

  test('Delete token', async () => {
    const MockedAuthenticationRepository = <jest.Mock<IAuthentications>>jest.fn(
      () => {
        let auth: Auth[] = [
          {
            accessToken: 'access_token_1',
            refreshToken: 'refresh_token_1',
          },
        ];

        return {
          async deleteToken(refreshToken) {
            auth = auth.filter(a => a.refreshToken !== refreshToken);
          },
          async isAccessTokenExist(accessToken): Promise<boolean> {
            return auth.some(a => a.accessToken === accessToken);
          },
        };
      },
    );
    const model = new Authentications(new MockedAuthenticationRepository());

    await model.deleteToken('refresh_token_1');
    expect(await model.isAccessTokenExist('access_token_1')).toBeFalsy();
  });
});
