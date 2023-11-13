import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Comments } from '~/use-cases/comments';

export async function POST(req: Request) {
  const { threadId } = req.params;
  const payload = JSON.parse(req.payload) as CommentPayload;
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const addedComment = await Comments.createComment(
    token.username as string,
    threadId,
    payload,
  );

  return Send.new({ addedComment }, { status: 201 });
}
