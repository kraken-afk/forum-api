import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Threads as ThreadsModel } from '~/domains/models/threads';
import { Users as UsersModel } from '~/domains/models/users';
import { threads } from '~/modules/models/threads-model';
import { users } from '~/modules/models/users-model';
import { threadPayloadValidator } from '~/modules/validators/thread-payload-validator';

type ThreadsUseCaseModels = {
  users: UsersModel;
  threads: ThreadsModel;
};

export class ThreadsUseCase {
  constructor(private models: ThreadsUseCaseModels) {}

  async createThread(
    ownerUsername: string,
    payload: ThreadPayload,
  ): Promise<{
    id: string;
    title: string;
    owner: string;
  }> {
    const user = await this.models.users.select(ownerUsername);

    threadPayloadValidator(payload);

    if (!user) throw new UnauthorizedError('User not listed on database');

    const addedThread = await this.models.threads.create(
      payload.title,
      payload.body,
      user.id,
    );

    return addedThread;
  }

  async getThreadDetail(threadId: string): Promise<
    | {
        id: string;
        title: string;
        body: string;
        username: string;
        date: Date;
        comments: Array<{
          id: string;
          username: string;
          date: Date;
          content: string;
          likeCount: number;
          replies: Array<{
            id: string;
            content: string;
            date: Date;
            username: string;
            isDeleted: boolean;
          }>;
        }>;
      }
    | undefined
  > {
    const thread = await this.models.threads.getThreadsWithComments(threadId);

    if (!thread)
      throw new NotFoundError(`Thread with id: ${threadId} cannot be find.`);

    const newComment = thread?.comments.map(comment => {
      const newComment = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        likeCount: comment.likes.length,
        replies: comment.replies,
      };

      newComment.replies = comment.replies.map(reply => {
        reply.content = reply.isDeleted
          ? '**balasan telah dihapus**'
          : reply.content;
        return reply;
      });
      newComment.content = comment.isDeleted
        ? '**komentar telah dihapus**'
        : comment.content;

      return newComment;
    });

    return {
      id: thread.id,
      body: thread.body,
      date: thread.date,
      title: thread.title,
      username: thread.username,
      comments: newComment,
    };
  }
}

export const Threads = new ThreadsUseCase({ threads, users });
