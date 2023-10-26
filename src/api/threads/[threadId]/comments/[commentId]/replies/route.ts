import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { comments } from '~/modules/models/comments-model';
import { replies } from '~/modules/models/replies-model';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';
import { replyPayloadValidator } from '~/modules/validators/reply-payload-validator';

export async function POST(req: Request) {
  const [thread, comment] = await Promise.all([
    threads.select(req.params.threadId),
    comments.select(req.params.commentId),
  ]);

  if (!thread)
    throw new NotFoundError(
      `Thread with id: ${req.params.threadId} cannot be found.`,
    );

  if (!comment)
    throw new NotFoundError(
      `Comment with id: ${req.params.commentId} cannot be found.`,
    );

  const payload = JSON.parse(req.payload) as ReplyPayload;
  const auth = req.headers?.authorization?.split(' ')[1];

  replyPayloadValidator(payload);

  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const user = await users.select(token.username as string);

  if (!user) throw new UnauthorizedError('User not listed on database');

  const addedReply = await replies.create(
    user.id,
    req.params.commentId,
    payload.content,
  );

  return Send.new({ addedReply }, { status: 201 });
}
