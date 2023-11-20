import { asc, eq, or } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Ithreads } from '~/infrastructure/contracts/T-threads';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';

export class ThreadsRepository implements Ithreads {
  constructor(readonly db: PostgresJsDatabase) {}

  async getThreadsWithComments(
    threadId: string,
  ): Promise<ThreadsDetail | undefined> {
    const threadRaw = this.db
      .selectDistinct({
        id: threads.id,
        title: threads.title,
        body: threads.body,
        date: threads.createdAt,
        username: users.username,
      })
      .from(threads)
      .where(eq(threads.id, threadId))
      .innerJoin(users, eq(users.id, threads.ownerId));
    const threadComments = this.db
      .selectDistinct({
        id: comments.id,
        username: users.username,
        date: comments.createdAt,
        content: comments.content,
        isDeleted: comments.isDeleted,
      })
      .from(comments)
      .where(eq(comments.masterId, threadId))
      .innerJoin(users, eq(comments.ownerId, users.id))
      .orderBy(asc(comments.createdAt));

    const [[thread], commentList] = await Promise.all([
      threadRaw,
      threadComments,
    ]);

    if (!thread) return undefined;

    const reply = await this.db
      .selectDistinct({
        id: replies.id,
        content: replies.content,
        date: replies.createdAt,
        username: users.username,
        masterId: replies.masterId,
        isDeleted: replies.isDeleted,
      })
      .from(replies)
      .where(
        or(...commentList.map(comment => eq(replies.masterId, comment.id))),
      )
      .innerJoin(users, eq(replies.ownerId, users.id))
      .orderBy(asc(replies.createdAt));

    const result = Object.assign(thread, {
      comments: commentList.map(comment => {
        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
          isDeleted: comment.isDeleted,
          replies: reply
            .filter(reply => reply.masterId === comment.id)
            .map(reply => ({
              id: reply.id,
              username: reply.username,
              date: reply.date,
              content: reply.content,
              isDeleted: reply.isDeleted,
            })),
        };
      }),
    });

    return result as ThreadsDetail;
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
    return (
      await this.db.insert(threads).values({ title, body, ownerId }).returning({
        title: threads.title,
        id: threads.id,
        owner: threads.ownerId,
      })
    )[0];
  }

  async select(id: string): Promise<Thread | undefined> {
    return (
      await this.db
        .selectDistinct({
          id: threads.id,
          title: threads.title,
          body: threads.body,
          date: threads.createdAt,
          owner: threads.ownerId,
        })
        .from(threads)
        .where(eq(threads.id, id))
    )[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(threads).where(eq(threads.id, id));
  }

  async update(
    id: string,
    { title, body }: Partial<ThreadPayload>,
  ): Promise<Thread> {
    return (
      await this.db
        .update(threads)
        .set({ title, body })
        .where(eq(threads.id, id))
        .returning({
          id: threads.id,
          title: threads.title,
          body: threads.body,
          date: threads.createdAt,
          owner: threads.ownerId,
        })
    )[0];
  }
}
