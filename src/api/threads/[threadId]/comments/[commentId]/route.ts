import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import type { Request } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';
import { comments } from '~/modules/models/comments-model';
import { users } from '~/modules/models/users-model';
import { jwt } from '~/modules/security/jwt';

export async function DELETE(req: Request) {
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const commentId = req.params?.commentId;
  const [comment, user] = await Promise.all([
    comments.select(commentId),
    users.select(token.username as string),
  ]);

  if (!comment)
    throw new NotFoundError(`Comment with id: ${commentId} cannot be find.`);

  if (!user) throw new UnauthorizedError('User not listed on database');

  if (user.id !== (await users.select(comment.owner))?.id)
    throw new ForbiddenError('Only the author of the comment could do delete.');

  void (await comments.delete(commentId));
  return Send.new({});
}
