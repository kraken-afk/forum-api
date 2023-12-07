import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Comments } from '~/use-cases/comments';

export async function PUT(req: Request) {
  const { threadId, commentId } = req.params;
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const username = token!.username as string;

  const { likeCount } = await Comments.likeComment(
    username,
    commentId,
    threadId,
  );

  return Send.new({ likeCount });
}
