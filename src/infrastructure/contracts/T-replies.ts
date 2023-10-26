import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type RepliesOptions = {
  all?: boolean;
};

export interface IReplies {
  readonly db: PostgresJsDatabase;
  select: (
    id: string,
    options?: RepliesOptions,
  ) => Promise<Reply | undefined> | Reply | undefined;
  update: (id: string, content: string) => Promise<Reply> | Reply;
  create: (
    ownerId: string,
    masterId: string,
    content: string,
  ) => Promise<Reply> | Reply;
  delete: (commentId: string) => Promise<void> | void;
}
