import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Replies } from '~/use-cases/replies';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as ReplyPayload;
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;
  const addedReply = await Replies.createReply(
    token.username as string,
    {
      commentId: req.params.commentId,
      threadId: req.params.threadId,
    },
    payload,
  );

  return Send.new({ addedReply }, { status: 201 });
}
