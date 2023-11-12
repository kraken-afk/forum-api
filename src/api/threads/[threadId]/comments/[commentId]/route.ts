import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Comments } from '~/use-cases/comments';

export async function DELETE(req: Request) {
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const commentId = req.params?.commentId;

  void (await Comments.deleteComment(commentId, token.username as string));
  return Send.new({});
}
