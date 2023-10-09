import type { Request } from '~/core/mod';
import { Send } from '~/core/mod';
import { ClientError } from '~/errors/client-error';
import { db } from '~/modules/models/users-model';
import { userPayloadValidator } from '~/modules/validators/user-payload-validator';

export async function post(req: Request) {
  const payload = JSON.parse(req.payload) as UserPayload;

  userPayloadValidator(payload);

  if (await db.users.isUsernameExist(payload.username))
    throw new ClientError('username tidak tersedia');

  const returnedUser = await db.users.createUser(payload);
  const newUser = returnedUser[0];

  return Send.new({ addedUser: newUser }, { status: 201 });
}
