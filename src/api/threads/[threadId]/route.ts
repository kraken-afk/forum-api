import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { Threads } from '~/use-cases/threads';

export async function GET(req: Request) {
  const thread = await Threads.getThreadDetail(req.params?.threadId);
  return Send.new({ thread });
}
