import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IReplies, RepliesOptions } from '~/infrastructure/contracts/T-replies';
import { replies, users } from '~/infrastructure/database/schema';

export class RepliesRepository implements IReplies {
  constructor(readonly db: PostgresJsDatabase) {}

  async select(
    id: string,
    options: RepliesOptions = { all: false },
  ): Promise<
    (Reply & { masterId: string; isDeleted: boolean | null }) | undefined
  > {
    const [data] = options.all
      ? await this.db
          .select()
          .from(replies)
          .where(eq(replies.id, id))
          .innerJoin(users, eq(replies.ownerId, users.id))
      : await this.db
          .select()
          .from(replies)
          .where(and(eq(replies.id, id), eq(replies.isDeleted, false)))
          .innerJoin(users, eq(replies.ownerId, users.id));

    if (!data) return undefined;

    const result = {
      id: data.replies.id,
      content: data.replies.content,
      owner: data.users.id,
      masterId: data.replies.masterId,
      isDeleted: data.replies.isDeleted,
    };

    return result;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<Reply> {
    const returnedComment = (
      await this.db
        .insert(replies)
        .values({ ownerId, content, masterId })
        .returning({
          id: replies.id,
          content: replies.content,
          owner: replies.ownerId,
        })
    )[0];

    return returnedComment;
  }

  async update(
    replyId: string,
    content: string,
  ): Promise<Reply & { editedAt: Date }> {
    const {
      content: comment,
      editedAt,
      id,
      owner,
    } = (
      await this.db
        .update(replies)
        .set({ content })
        .where(eq(replies.id, replyId))
        .returning({
          id: replies.id,
          content: replies.content,
          editedAt: replies.updatedAt,
          owner: replies.ownerId,
        })
    )[0];

    return { id, owner, content: comment, editedAt };
  }

  async delete(replyId: string): Promise<void> {
    await this.db
      .update(replies)
      .set({ isDeleted: true })
      .where(eq(replies.id, replyId));
  }
}
