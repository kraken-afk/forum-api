import { ClientError } from '~/commons/errors/client-error';
import { Users as UsersModel } from '~/domains/models/users';
import { users } from '~/modules/models/users-model';
import { userPayloadValidator } from '~/modules/validators/user-payload-validator';

export class UsersUseCase {
  constructor(private model: UsersModel) {}

  async createUser(payload: UserPayload): Promise<User> {
    userPayloadValidator(payload);

    if (await this.model.isUsernameExist(payload.username))
      throw new ClientError('username tidak tersedia');

    const newUser = await this.model.create(payload);
    return newUser;
  }
}

export const Users = new UsersUseCase(users);
