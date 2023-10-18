import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface IAuthentications {
  readonly db: PostgresJsDatabase;
  insert: (accessToken: string, refreshToken: string) => Promise<void> | void;
  deleteToken: (refreshToken: string) => Promise<void> | void;
  isRefreshTokenExist: (refreshToken: string) => Promise<boolean> | boolean;
  isAccessTokenExist: (token: string) => Promise<boolean> | boolean;
  updateToken: (
    newToken: string,
    refreshToken: string,
  ) => Promise<{ accessToken: string }> | { accessToken: string };
}
