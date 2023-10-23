import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import { Ithreads } from '~/infrastructure/contracts/T-threads';

export class ThreadsMock implements Ithreads {
  public thread: Thread = {
    body: '',
    date: new Date(),
    id: '',
    owner: '',
    title: '',
  };

  constructor(readonly db: PostgresJsDatabase) {}

  async getThreadsWithComments(
    threadId: string,
  ): Promise<ThreadsDetail | undefined> {
    await setTimeout(() => {}, 10);

    return {
      id: threadId,
      body: '',
      date: new Date(),
      title: '',
      username: '',
      comments: [],
    };
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
    await setTimeout(() => {}, 15);

    const date = new Date();
    const id = randomStr(5);
    this.thread = { id, body, title, owner: ownerId, date: date };

    return this.thread;
  }

  async select(id: string): Promise<Thread | undefined> {
    if (this.thread.id !== id) return undefined;

    await setTimeout(() => {}, 15);

    return this.thread;
  }

  async delete(id: string): Promise<void> {
    await setTimeout(() => {}, 15);

    if (this.thread.id !== id) throw new Error("Thread Doesn't exist");

    this.thread = {
      body: '',
      date: new Date(),
      id: '',
      owner: '',
      title: '',
    };
  }

  async update(
    id: string,
    { title, body }: Partial<ThreadPayload>,
  ): Promise<Thread> {
    if (this.thread.id !== id) throw new Error("Thread Doesn't exist");

    this.thread.title = title || this.thread.title;
    this.thread.body = body || this.thread.body;

    return this.thread;
  }
}
