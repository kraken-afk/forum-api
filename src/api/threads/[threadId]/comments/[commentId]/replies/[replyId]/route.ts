import type { Request } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';
import { jwt } from '~/modules/security/jwt';
import { Replies } from '~/use-cases/replies';

export async function DELETE(req: Request) {
  const auth = req.headers?.authorization?.split(' ')[1];
  const token = jwt.unpack(auth!) as Record<string, unknown>;

  void (await Replies.deleteReply(
    req.params.replyId,
    token.username as string,
    {
      commentId: req.params.commentId,
      threadId: req.params.threadId,
    },
  ));

  return Send.new({});
}
