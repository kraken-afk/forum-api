import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type CommentOption = {
  all?: boolean;
};

export interface IComments {
  readonly db: PostgresJsDatabase;
  select: (
    id: string,
    options?: CommentOption,
  ) =>
    | Promise<(TComment & { masterId: string }) | undefined>
    | (TComment & { masterId: string })
    | undefined;
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
