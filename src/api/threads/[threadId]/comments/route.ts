import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { comments } from '~/modules/models/comments-model';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';
import { commentPayloadValidator } from '~/modules/validators/comment-payload-validator';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as CommentPayload;
  const auth = req.headers?.authorization?.split(' ')[1];
  const { threadId } = req.params;

  commentPayloadValidator(payload);

  if (!(await threads.select(threadId)))
    throw new NotFoundError(`Thread with id: ${threadId} cannot be found.`);

  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const user = await users.select(token.username as string);

  if (!user) throw new UnauthorizedError('User not listed on database');

  const addedComment = await comments.create(
    user.id,
    threadId,
    payload.content,
  );

  return Send.new({ addedComment }, { status: 201 });
}
