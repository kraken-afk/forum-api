import { ClientError } from '~/commons/errors/client-error';
import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Comments } from '~/domains/models/comments';
import { Replies as RepliesModel } from '~/domains/models/replies';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';
import { comments } from '~/modules/models/comments-model';
import { replies } from '~/modules/models/replies-model';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { replyPayloadValidator } from '~/modules/validators/reply-payload-validator';

type ReplyMaster = {
  commentId: string;
  threadId: string;
};

type RepliesUseCaseModels = {
  users: Users;
  comments: Comments;
  threads: Threads;
  replies: RepliesModel;
};

export class RepliesUseCase {
  constructor(private models: RepliesUseCaseModels) {}

  async createReply(
    ownerUsername: string,
    masters: ReplyMaster,
    payload: ReplyPayload,
  ): Promise<Reply> {
    replyPayloadValidator(payload);
    const { comments, threads, users, replies } = this.models;
    const [user, comment, thread] = await Promise.all([
      users.select(ownerUsername),
      comments.select(masters.commentId),
      threads.select(masters.threadId),
    ]);

    if (!user) throw new UnauthorizedError('User not listed on database');

    if (!thread)
      throw new NotFoundError(
        `Thread with id: ${masters.threadId} cannot be found.`,
      );

    if (!comment)
      throw new NotFoundError(
        `Comment with id: ${masters.commentId} cannot be found.`,
      );

    if (comment.masterId !== thread.id)
      throw new ClientError('Comment is not found in the current thread.');

    const addedReply = replies.create(user.id, comment.id, payload.content);

    return addedReply;
  }

  async deleteReply(
    replyId: string,
    ownerUsername: string,
    masters: ReplyMaster,
  ): Promise<void> {
    const { comments, threads, users, replies } = this.models;
    const [user, comment, thread, reply] = await Promise.all([
      users.select(ownerUsername),
      comments.select(masters.commentId),
      threads.select(masters.threadId),
      replies.select(replyId),
    ]);

    if (!user) throw new UnauthorizedError('User not listed on database');

    if (!thread)
      throw new NotFoundError(
        `Thread with id: ${masters.threadId} cannot be found.`,
      );

    if (!comment)
      throw new NotFoundError(
        `Comment with id: ${masters.commentId} cannot be found.`,
      );

    if (!reply)
      throw new NotFoundError(`Reply with id: ${replyId} cannot be found.`);

    if (comment.masterId !== thread.id)
      throw new ClientError('Comment is not found in the current thread.');

    if (reply?.masterId !== comment.id)
      throw new ClientError('Reply is not found in the current comment.');

    if (user.id !== reply.owner)
      throw new ForbiddenError('Only the author could do the action');

    void (await replies.delete(reply.id));
  }
}

export const Replies = new RepliesUseCase({
  users,
  threads,
  comments,
  replies,
});
