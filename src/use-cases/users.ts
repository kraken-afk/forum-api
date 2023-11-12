import { ClientError } from '~/commons/errors/client-error';
import { Users as UsersModel } from '~/domains/models/users';
import { users } from '~/modules/models/users-model';
import { userPayloadValidator } from '~/modules/validators/user-payload-validator';

export namespace Users {
  export async function createUser(
    payload: UserPayload,
    model: UsersModel = users,
  ): Promise<User> {
    userPayloadValidator(payload);

    if (await model.isUsernameExist(payload.username))
      throw new ClientError('username tidak tersedia');

    const newUser = await model.create(payload);
    return newUser;
  }
}
