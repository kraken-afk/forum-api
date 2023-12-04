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

  async getThreadDetail(threadId: string): Promise<ThreadsDetail | undefined> {
    const thread = await this.models.threads.getThreadsWithComments(threadId);

    if (!thread)
      throw new NotFoundError(`Thread with id: ${threadId} cannot be find.`);

    thread.comments = thread?.comments.map(comment => {
      comment.replies = comment.replies.map(reply => {
        reply.content = reply.isDeleted
          ? '**balasan telah dihapus**'
          : reply.content;
        return reply;
      });
      comment.content = comment.isDeleted
        ? '**komentar telah dihapus**'
        : comment.content;

      return comment;
    });

    return thread;
  }
}

export const Threads = new ThreadsUseCase({ threads, users });
