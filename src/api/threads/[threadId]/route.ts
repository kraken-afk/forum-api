import { NotFoundError } from '~/commons/errors/not-found-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { threads } from '~/modules/models/threads-model';

export async function GET(req: Request) {
  const thread = await threads.getThreadsWithComments(req.params?.threadId);

  if (!thread)
    throw new NotFoundError(
      `Thread with id: ${req.params?.threadId} cannot be find.`,
    );
  return Send.new({ thread });
}
