import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import {
  CommentOption,
  IComments,
} from '~/infrastructure/contracts/T-comments';

export class CommentsMock implements IComments {
  public comment: TComment & {
    master: string;
    ownerId: string;
    isDeleted: boolean;
  } = {
    content: '',
    date: new Date(),
    id: '',
    owner: '',
    ownerId: '',
    master: '',
    isDeleted: false,
  };
  constructor(readonly db: PostgresJsDatabase) {}

  async select(
    id: string,
    options?: CommentOption,
  ): Promise<TComment | undefined> {
    await setTimeout(() => {}, 10);
    if (this.comment.id !== id) return undefined;
    if (options?.all) return this.comment;
    if (!this.comment.isDeleted) return this.comment;
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
      owner: '',
      isDeleted: false,
    };

    return {
      content: this.comment.content,
      date: this.comment.date,
      id: this.comment.id,
      owner: this.comment.owner,
    };
  }

  update(commentId: string, content: string): TComment & { editedAt: Date } {
    if (this.comment.id !== commentId) throw new Error("Comment doesn't exist");

    this.comment.content = content;

    const editedAt = new Date();
    const { content: comment, id, owner, date } = this.comment;
    return { content: comment, id, editedAt, owner, date };
  }

  async delete(commentId: string): Promise<void> {
    if (this.comment.id !== commentId) throw new Error("Comment doesn't exist");

    this.comment.isDeleted = true;
  }
}
