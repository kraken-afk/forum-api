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

export class CommentsUseCase {
  constructor(private models: CommentsUseCaseModels) {}

  async createComment(
    ownerUsername: string,
    masterId: string,
    payload: CommentPayload,
  ): Promise<TComment> {
    commentPayloadValidator(payload);

    const { users, threads, comments } = this.models;
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

  async deleteComment(commentId: string, ownerUsername: string): Promise<void> {
    const { comments, users } = this.models;
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

  async likeComment(
    username: string,
    commentId: string,
    masterId: string,
  ): Promise<{ likeCount: number }> {
    const [user, comment, thread] = await Promise.all([
      this.models.users.select(username),
      this.models.comments.select(commentId),
      this.models.threads.select(masterId),
    ]);

    if (!user) throw new UnauthorizedError('Unauthorized action');
    if (!comment) throw new NotFoundError('404 Error: Comment not found');
    if (!thread) throw new NotFoundError('404 Error: Thread not found');

    const { likes } = await this.models.comments.like(user.id, comment.id);

    return { likeCount: likes.length };
  }
}

export const Comments = new CommentsUseCase({ comments, threads, users });
