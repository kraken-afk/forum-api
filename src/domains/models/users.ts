import { IUsers } from '~/infrastructure/contracts/T-users';

export class Users {
  constructor(private readonly repository: IUsers) {}

  async createUser(payload: UserPayload): Promise<{
    username: string;
    fullname: string;
    id: string;
  }> {
    return await this.repository.createUser(payload);
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
