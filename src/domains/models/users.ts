import { IUsers } from '~/infrastructure/contracts/T-users';

export class Users {
  constructor(private readonly repository: IUsers) {}

  create(payload: UserPayload): Promise<User> {
    return this.repository.create(payload) as Promise<User>;
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id) as Promise<void>;
  }

  select(username: string): Promise<User | undefined> {
    return this.repository.select(username) as Promise<User | undefined>;
  }

  isUsernameExist(username: string): Promise<boolean> {
    return this.repository.isUsernameExist(username) as Promise<boolean>;
  }

  isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    return this.repository.isPasswordAndUsernameMatch(
      username,
      password,
    ) as Promise<boolean>;
  }
}
