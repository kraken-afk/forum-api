import { IAuthentications } from '~/infrastructure/contracts/T-authentications';

export class Authentications {
  constructor(private readonly repository: IAuthentications) {}

  insert(accessToken: string, refreshToken: string): Promise<Auth> {
    return this.repository.insert(accessToken, refreshToken) as Promise<Auth>;
  }

  updateToken(
    newToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.repository.updateToken(newToken, refreshToken) as Promise<{
      accessToken: string;
    }>;
  }

  deleteToken(refreshToken: string): Promise<void> {
    return this.repository.deleteToken(refreshToken) as Promise<void>;
  }

  isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    return this.repository.isRefreshTokenExist(
      refreshToken,
    ) as Promise<boolean>;
  }

  isAccessTokenExist(token: string): Promise<boolean> {
    return this.repository.isAccessTokenExist(token) as Promise<boolean>;
  }
}
