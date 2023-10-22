import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import { IComments } from '~/infrastructure/contracts/T-comments';

export class CommentsMock implements IComments {
  public comment: TComment & { master: string; ownerId: string } = {
    content: '',
    date: new Date(),
    id: '',
    username: '',
    ownerId: '',
    master: '',
  };
  constructor(readonly db: PostgresJsDatabase) {}

  async select(id: string): Promise<TComment | undefined> {
    await setTimeout(() => {}, 10);
    if (this.comment.id !== id) return undefined;
    return this.comment;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<TComment> {
    await setTimeout(() => {}, 10);
    this.comment = {
      content,
      date: new Date(),
      id: randomStr(7),
      master: masterId,
      ownerId,
      username: '',
    };

    return {
      content: this.comment.content,
      date: this.comment.date,
      id: this.comment.id,
      username: this.comment.username,
    };
  }

  update(commentId: string, content: string): TComment & { editedAt: Date } {
    if (this.comment.id !== commentId) throw new Error("Comment doesn't exist");

    this.comment.content = content;

    const editedAt = new Date();
    const { content: comment, id, username, date } = this.comment;
    return { content: comment, id, editedAt, username, date };
  }

  async delete(commentId: string): Promise<void> {
    if (this.comment.id !== commentId) throw new Error("Comment doesn't exist");

    this.comment = {
      content: '',
      date: new Date(),
      id: '',
      username: '',
      ownerId: '',
      master: '',
    };
  }
}
