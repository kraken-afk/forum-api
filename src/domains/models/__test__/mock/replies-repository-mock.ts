import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import { IReplies, RepliesOptions } from '~/infrastructure/contracts/T-replies';

export class RepliesMock implements IReplies {
  public reply: Reply & { isDeleted: boolean } = {
    content: '',
    id: '',
    owner: '',
    isDeleted: false,
  };
  public masterId = '';
  constructor(readonly db: PostgresJsDatabase) {}

  async select(
    id: string,
    options: RepliesOptions = { all: false },
  ): Promise<Reply | undefined> {
    if (this.reply.id !== id) return undefined;
    if (options?.all) return this.reply;
    if (!this.reply.isDeleted) return this.reply;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<Reply> {
    this.reply = {
      content,
      id: randomStr(7),
      owner: ownerId,
      isDeleted: false,
    };
    this.masterId = masterId;

    return this.reply;
  }

  async update(
    replyId: string,
    content: string,
  ): Promise<Reply & { editedAt: Date }> {
    if (this.reply.id !== replyId) throw new Error("Reply doesn't exist");
    const editedAt = new Date();

    this.reply.content = content;

    return {
      content: this.reply.content,
      editedAt,
      id: this.reply.id,
      owner: this.reply.owner,
    };
  }

  async delete(replyId: string): Promise<void> {
    if (this.reply.id !== replyId) throw new Error("Reply doesn't exist");
    this.reply.isDeleted = true;
  }
}
