import { Ithreads } from '~/infrastructure/contracts/T-threads';

export class Threads {
  constructor(private readonly repository: Ithreads) {}

  async getThreadsWithComments(
    threadId: string,
  ): Promise<ThreadsDetail | undefined> {
    return await this.repository.getThreadsWithComments(threadId);
  }

  async create(
    title: string,
    body: string,
    ownerId: string,
  ): Promise<{
    id: string;
    title: string;
    owner: string;
  }> {
    return await this.repository.create(title, body, ownerId);
  }

  async select(id: string): Promise<Thread | undefined> {
    return this.repository.select(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async update(id: string, payload: Partial<ThreadPayload>): Promise<Thread> {
    return await this.repository.update(id, payload);
  }
}
