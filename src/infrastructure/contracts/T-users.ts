import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface IUsers {
  readonly db: PostgresJsDatabase;
  isUsernameExist: (username: string) => Promise<boolean> | boolean;
  createUser: (payload: UserPayload) =>
    | Promise<{
        username: string;
        fullname: string;
        id: string;
      }>
    | {
        username: string;
        fullname: string;
        id: string;
      };

  isPasswordAndUsernameMatch: (
    username: string,
    password: string,
  ) => Promise<boolean> | boolean;
}
