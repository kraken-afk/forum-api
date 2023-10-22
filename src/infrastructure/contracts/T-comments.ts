import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface IComments {
  readonly db: PostgresJsDatabase;
  select: (id: string) => Promise<TComment | undefined> | TComment | undefined;
  update: (
    id: string,
    content: string,
  ) => Promise<TComment & { editedAt: Date }> | (TComment & { editedAt: Date });
  create: (
    ownerId: string,
    masterId: string,
    content: string,
  ) => Promise<TComment> | TComment;
  delete: (commentId: string) => Promise<void> | void;
}
