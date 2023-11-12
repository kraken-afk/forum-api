import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type {
  CommentOption,
  IComments,
} from '~/infrastructure/contracts/T-comments';
import { comments, users } from '~/infrastructure/database/schema';

export class CommentsRepository implements IComments {
  constructor(readonly db: PostgresJsDatabase) {}

  async select(
    id: string,
    options: CommentOption = { all: false },
  ): Promise<(TComment & { masterId: string }) | undefined> {
    const [data] = options.all
      ? await this.db
          .selectDistinct({
            id: comments.id,
            content: comments.content,
            date: comments.createdAt,
            owner: users.username,
            masterId: comments.masterId,
          })
          .from(comments)
          .where(eq(comments.id, id))
          .innerJoin(users, eq(comments.ownerId, users.id))
      : await this.db
          .selectDistinct({
            id: comments.id,
            content: comments.content,
            date: comments.createdAt,
            owner: users.username,
            masterId: comments.masterId,
          })
          .from(comments)
          .where(and(eq(comments.id, id), eq(comments.isDeleted, false)))
          .innerJoin(users, eq(comments.ownerId, users.id));

    if (!data) return undefined;

    const result = {
      id: data.id,
      content: data.content,
      date: data.date,
      owner: data.owner,
      masterId: data.masterId,
    };

    return result;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<TComment> {
    const user = this.db
      .selectDistinct({ owner: users.username })
      .from(users)
      .where(eq(users.id, ownerId));
    const returnedComment = this.db
      .insert(comments)
      .values({ ownerId, content, masterId })
      .returning({
        id: comments.id,
        date: comments.createdAt,
        content: comments.content,
      });

    const [[{ owner }], [{ id, content: comment, date }]] = await Promise.all([
      user,
      returnedComment,
    ]);

    return { id, owner, content: comment, date };
  }

  async update(
    commentId: string,
    content: string,
  ): Promise<TComment & { editedAt: Date }> {
    const {
      content: comment,
      date,
      editedAt,
      id,
      ownerId,
    } = (
      await this.db
        .update(comments)
        .set({ content })
        .where(eq(comments.id, commentId))
        .returning({
          id: comments.id,
          date: comments.createdAt,
          content: comments.content,
          editedAt: comments.updatedAt,
          ownerId: comments.ownerId,
        })
    )[0];

    const [{ owner }] = await this.db
      .selectDistinct({ owner: users.username })
      .from(users)
      .where(eq(users.id, ownerId));

    return { id, owner, content: comment, date, editedAt };
  }

  async delete(commentId: string): Promise<void> {
    await this.db
      .update(comments)
      .set({ isDeleted: true })
      .where(eq(comments.id, commentId));
  }
}
