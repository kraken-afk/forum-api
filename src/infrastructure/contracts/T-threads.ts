import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface Ithreads {
  readonly db: PostgresJsDatabase;
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
  select: (id: string) => Promise<Thread> | Thread;
  delete: (id: string) => Promise<void> | void;
  update: (
    id: string,
    payload: Partial<ThreadPayload>,
  ) => Promise<Thread> | Thread;
}
