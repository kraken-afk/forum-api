import { IAuthentications } from '~/infrastructure/contracts/T-authentications';

export class Authentications {
  constructor(private readonly repository: IAuthentications) {}

  async insert(accessToken: string, refreshToken: string): Promise<void> {
    return await this.repository.insert(accessToken, refreshToken);
  }

  async updateToken(
    newToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.repository.updateToken(newToken, refreshToken);
  }

  async deleteToken(refreshToken: string): Promise<void> {
    return await this.repository.deleteToken(refreshToken);
  }

  async isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    return await this.repository.isRefreshTokenExist(refreshToken);
  }

  async isAccessTokenExist(token: string): Promise<boolean> {
    return await this.repository.isAccessTokenExist(token);
  }
}
