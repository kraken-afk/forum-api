import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Threads } from '~/use-cases/threads';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as ThreadPayload;
  const [_authType, token] = req.headers.authorization?.split(' ')!;
  const unpackedJwt = jwt.unpack(token) as Record<string, unknown>;
  const addedThread = await Threads.createThread(
    unpackedJwt?.username as string,
    payload,
  );

  return Send.new({ addedThread }, { status: 201 });
}
