import { ClientError } from '~/commons/errors/client-error';
import { type Request, Send } from '~/infrastructure/core/mod';
import { users } from '~/modules/models/users-model';
import { userPayloadValidator } from '~/modules/validators/user-payload-validator';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as UserPayload;

  userPayloadValidator(payload);

  if (await users.isUsernameExist(payload.username))
    throw new ClientError('username tidak tersedia');

  const newUser = await users.createUser(payload);
  return Send.new({ addedUser: newUser }, { status: 201 });
}
