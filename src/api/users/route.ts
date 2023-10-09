import type { Request } from '~/core/mod';
import { Send } from '~/core/mod';
import { ClientError } from '~/errors/client-error';
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
