import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { comments } from '~/modules/models/comments-model';
import { replies } from '~/modules/models/replies-model';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';

export async function DELETE(req: Request) {
  const [thread, comment, reply] = await Promise.all([
    threads.select(req.params.threadId),
    comments.select(req.params.commentId),
    replies.select(req.params.replyId),
  ]);

  if (!thread)
    throw new NotFoundError(
      `Thread with id: ${req.params.threadId} cannot be found.`,
    );

  if (!comment)
    throw new NotFoundError(
      `Comment with id: ${req.params.commentId} cannot be found.`,
    );

  if (!reply)
    throw new NotFoundError(
      `Reply with id: ${req.params.replyId} cannot be found.`,
    );

  const auth = req.headers?.authorization?.split(' ')[1];

  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const user = await users.select(token.username as string);

  if (!user) throw new UnauthorizedError('User not listed on database');
  if (user.id !== reply.owner)
    throw new ForbiddenError('Only the author could do the action');

  void (await replies.delete(req.params.replyId));

  return Send.new({});
}
