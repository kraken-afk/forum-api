import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import { IUsers } from '~/infrastructure/contracts/T-users';

export class UsersMock implements IUsers {
  public user: User & { password: string } = {
    id: '',
    fullname: '',
    username: '',
    password: '',
  };

  constructor(public readonly db: PostgresJsDatabase) {}

  async create(payload: UserPayload): Promise<User> {
    const id = randomStr(5);
    this.user = {
      fullname: payload.fullname,
      id,
      username: payload.username,
      password: payload.password,
    };

    await setTimeout(() => {}, 10);
    return this.user;
  }

  async delete(id: string): Promise<void> {
    await setTimeout(() => {}, 10);
    if (this.user.id !== id) throw new Error("User doesn't exist");

    this.user = { fullname: '', id: '', username: '', password: '' };
    await setTimeout(() => {}, 10);
  }

  async isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    await setTimeout(() => {}, 10);
    return this.user.username === username && this.user.password === password;
  }

  async isUsernameExist(username: string): Promise<boolean> {
    await setTimeout(() => {}, 10);
    return this.user.username === username;
  }

  async select(username: string): Promise<User | undefined> {
    if (this.user.username !== username) return undefined;

    const { fullname, id } = this.user;

    return { username, fullname, id };
  }
}
