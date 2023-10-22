import { IUsers } from '~/infrastructure/contracts/T-users';

export class Users {
  constructor(private readonly repository: IUsers) {}

  async create(payload: UserPayload): Promise<User> {
    return await this.repository.create(payload);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async select(username: string): Promise<User | undefined> {
    return await this.repository.select(username);
  }

  async isUsernameExist(username: string): Promise<boolean> {
    return await this.repository.isUsernameExist(username);
  }

  async isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    return await this.repository.isPasswordAndUsernameMatch(username, password);
  }
}
