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

export namespace Threads {
  export async function createThread(
    ownerUsername: string,
    payload: ThreadPayload,
    model: ThreadsUseCaseModels = { users, threads },
  ): Promise<{
    id: string;
    title: string;
    owner: string;
  }> {
    const user = await model.users.select(ownerUsername);

    threadPayloadValidator(payload);

    if (!user) throw new UnauthorizedError('User not listed on database');

    const addedThread = await model.threads.create(
      payload.title,
      payload.body,
      user.id,
    );

    return addedThread;
  }

  export async function getThreadDetail(
    threadId: string,
    model: ThreadsModel = threads,
  ): Promise<ThreadsDetail | undefined> {
    const thread = await model.getThreadsWithComments(threadId);

    if (!thread)
      throw new NotFoundError(`Thread with id: ${threadId} cannot be find.`);

    return thread;
  }
}
