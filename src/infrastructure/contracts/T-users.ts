import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface IUsers {
  readonly db: PostgresJsDatabase;
  create: (payload: UserPayload) => Promise<User> | User;
  delete: (id: string) => Promise<void> | void;
  select: (username: string) => Promise<User | undefined> | User | undefined;
  isUsernameExist: (username: string) => Promise<boolean> | boolean;
  isPasswordAndUsernameMatch: (
    username: string,
    password: string,
  ) => Promise<boolean> | boolean;
}
