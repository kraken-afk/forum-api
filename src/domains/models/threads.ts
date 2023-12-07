import { Ithreads } from '~/infrastructure/contracts/T-threads';

export class Threads {
  constructor(private readonly repository: Ithreads) {}

  getThreadsWithComments(threadId: string): Promise<ThreadsDetail | undefined> {
    return this.repository.getThreadsWithComments(threadId) as Promise<
      ThreadsDetail | undefined
    >;
  }

  create(
    title: string,
    body: string,
    ownerId: string,
  ): Promise<{
    id: string;
    title: string;
    owner: string;
  }> {
    return this.repository.create(title, body, ownerId) as Promise<{
      id: string;
      title: string;
      owner: string;
    }>;
  }

  select(id: string): Promise<Thread | undefined> {
    return this.repository.select(id) as Promise<Thread | undefined>;
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id) as Promise<void>;
  }

  update(id: string, payload: Partial<ThreadPayload>): Promise<Thread> {
    return this.repository.update(id, payload) as Promise<Thread>;
  }
}
