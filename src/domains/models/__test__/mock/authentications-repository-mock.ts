import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IAuthentications } from '~/infrastructure/contracts/T-authentications';

export class AuthenticationMock implements IAuthentications {
  public token: Auth = { accessToken: '', refreshToken: '' };

  constructor(public readonly db: PostgresJsDatabase) {}

  async deleteToken(): Promise<void> {
    await setTimeout(() => {}, 10);
    this.token = { accessToken: '', refreshToken: '' };
  }

  async insert(accessToken: string, refreshToken: string): Promise<Auth> {
    await setTimeout(() => {}, 10);

    this.token = { accessToken, refreshToken };

    return {
      accessToken,
      refreshToken,
    };
  }

  async isAccessTokenExist(token: string): Promise<boolean> {
    await setTimeout(() => {}, 10);
    return this.token.accessToken === token;
  }

  async isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    await setTimeout(() => {}, 10);
    return this.token.refreshToken === refreshToken;
  }

  async updateToken(
    newToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    await setTimeout(() => {}, 10);

    if (this.token.refreshToken !== refreshToken)
      throw new Error("refreshToken doesn't exist");

    this.token.accessToken = newToken;

    return { accessToken: newToken };
  }
}
