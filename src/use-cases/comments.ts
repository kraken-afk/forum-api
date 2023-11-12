import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Comments as CommentsModel } from '~/domains/models/comments';
import { Threads as ThreadsModel } from '~/domains/models/threads';
import { Users as UsersModel } from '~/domains/models/users';
import { comments } from '~/modules/models/comments-model';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { commentPayloadValidator } from '~/modules/validators/comment-payload-validator';

type CommentsUseCaseModels = {
  users: UsersModel;
  threads: ThreadsModel;
  comments: CommentsModel;
};

export namespace Comments {
  export async function createComment(
    ownerUsername: string,
    masterId: string,
    payload: CommentPayload,
    models: CommentsUseCaseModels = { users, comments, threads },
  ): Promise<TComment> {
    commentPayloadValidator(payload);

    const { users, threads, comments } = models;
    const [user, thread] = await Promise.all([
      users.select(ownerUsername),
      threads.select(masterId),
    ]);

    if (!thread)
      throw new NotFoundError(`Thread with id: ${masterId} cannot be found.`);

    if (!user) throw new UnauthorizedError('User not listed on database');

    const addedComment = await comments.create(
      user.id,
      thread.id,
      payload.content,
    );

    return addedComment;
  }

  export async function deleteComment(
    commentId: string,
    ownerUsername: string,
    models: Omit<CommentsUseCaseModels, 'threads'> = { comments, users },
  ): Promise<void> {
    const { comments, users } = models;
    const [comment, user] = await Promise.all([
      comments.select(commentId),
      users.select(ownerUsername),
    ]);

    if (!comment)
      throw new NotFoundError(`Comment with id: ${commentId} cannot be find.`);

    if (!user) throw new UnauthorizedError('User not listed on database');

    if (user.id !== (await users.select(comment.owner))?.id)
      throw new ForbiddenError('Only the author could do the action');

    return await comments.delete(commentId);
  }
}
