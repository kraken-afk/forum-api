import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface Ithreads {
  readonly db: PostgresJsDatabase;
  getThreadsWithComments: (
    threadId: string,
  ) => Promise<ThreadsDetail | undefined> | ThreadsDetail | undefined;
  create: (
    title: string,
    body: string,
    ownerId: string,
  ) =>
    | Promise<{
        id: string;
        title: string;
        owner: string;
      }>
    | {
        id: string;
        title: string;
        owner: string;
      };
  update: (
    id: string,
    payload: Partial<ThreadPayload>,
  ) => Promise<Thread> | Thread;
  select: (id: string) => Promise<Thread | undefined> | Thread | undefined;
  delete: (id: string) => Promise<void> | void;
}
