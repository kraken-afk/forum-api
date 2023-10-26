import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';
import { threadPayloadValidator } from '~/modules/validators/thread-payload-validator';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as ThreadPayload;

  threadPayloadValidator(payload);

  const [_authType, token] = req.headers.authorization?.split(' ')!;
  const unpackedJwt = jwt.unpack(token) as Record<string, unknown>;
  const user = await users.select(unpackedJwt?.username as string);

  if (!user) throw new UnauthorizedError('User not listed on database');

  const addedThread = await threads.create(
    payload.title,
    payload.body,
    user.id,
  );

  return Send.new({ addedThread }, { status: 201 });
}
