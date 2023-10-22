import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IComments } from '~/infrastructure/contracts/T-comments';
import { comments, users } from '~/infrastructure/database/schema';

export class CommentsRepository implements IComments {
  constructor(readonly db: PostgresJsDatabase) {}

  async select(id: string): Promise<TComment | undefined> {
    const [data] = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .innerJoin(users, eq(comments.ownerId, users.id));

    if (!data) return undefined;

    const result: TComment = {
      id: data.comments.id,
      content: data.comments.content,
      date: data.comments.createdAt,
      username: data.users.username,
    };

    return result;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<TComment> {
    const user = this.db
      .selectDistinct({ username: users.username })
      .from(users)
      .where(eq(users.id, ownerId));
    const returnedComment = this.db
      .insert(comments)
      .values({ ownerId, content, masterId: masterId })
      .returning({
        id: comments.id,
        date: comments.createdAt,
        content: comments.content,
      });

    const [[{ username }], [{ id, content: comment, date }]] =
      await Promise.all([user, returnedComment]);

    return { id, username, content: comment, date };
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

    const [{ username }] = await this.db
      .selectDistinct({ username: users.username })
      .from(users)
      .where(eq(users.id, ownerId));

    return { id, username, content: comment, date, editedAt };
  }

  async delete(commentId: string): Promise<void> {
    await this.db.delete(comments).where(eq(comments.id, commentId));
  }
}
