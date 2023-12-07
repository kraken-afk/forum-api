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
  ): Promise<
    (TComment & { masterId: string; isDeleted: boolean }) | undefined
  > {
    const [data] = options.all
      ? await this.db
          .selectDistinct({
            id: comments.id,
            content: comments.content,
            date: comments.createdAt,
            owner: users.username,
            masterId: comments.masterId,
            isDeleted: comments.isDeleted,
            likes: comments.likes,
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
            isDeleted: comments.isDeleted,
            likes: comments.likes,
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
      isDeleted: data.isDeleted,
      likes: data.likes,
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
        likes: comments.likes,
      });

    const [[{ owner }], [{ id, content: comment, date, likes }]] =
      await Promise.all([user, returnedComment]);

    return { id, owner, content: comment, date, likes };
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
      likes,
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
          likes: comments.likes,
        })
    )[0];

    const [{ owner }] = await this.db
      .selectDistinct({ owner: users.username })
      .from(users)
      .where(eq(users.id, ownerId));

    return {
      id,
      owner,
      content: comment,
      date,
      editedAt,
      likes,
    };
  }

  async delete(commentId: string): Promise<void> {
    await this.db
      .update(comments)
      .set({ isDeleted: true })
      .where(eq(comments.id, commentId));
  }
  async like(userId: string, commentId: string): Promise<TComment> {
    const data = (
      await this.db
        .selectDistinct({ likes: comments.likes })
        .from(comments)
        .where(eq(comments.id, commentId))
    )[0];

    if (data.likes.includes(userId))
      data.likes = data.likes.filter(e => e !== userId);
    else data.likes.push(userId);

    const { content, date, id, likes, owner } = (
      await this.db
        .update(comments)
        .set({ likes: data.likes })
        .where(eq(comments.id, commentId))
        .returning({
          id: comments.id,
          content: comments.content,
          owner: comments.ownerId,
          likes: comments.likes,
          date: comments.createdAt,
        })
    )[0];

    return {
      id,
      date,
      content,
      owner,
      likes,
    };
  }
}
