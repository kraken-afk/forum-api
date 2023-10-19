import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Ithreads } from '~/infrastructure/contracts/T-threads';
import { threads } from '~/infrastructure/database/schema';

export class ThreadsRepository implements Ithreads {
  constructor(readonly db: PostgresJsDatabase) {}

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

  async select(id: string): Promise<Thread> {
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
