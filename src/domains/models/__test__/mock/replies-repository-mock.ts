import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { randomStr } from '~/commons/libs/random-str';
import { IReplies } from '~/infrastructure/contracts/T-replies';

export class RepliesMock implements IReplies {
  public reply: Reply = {
    content: '',
    id: '',
    owner: '',
  };
  public masterId = '';
  constructor(readonly db: PostgresJsDatabase) {}

  async select(id: string): Promise<Reply | undefined> {
    if (this.reply.id !== id) throw new Error("Reply doesn't exist");
    return this.reply;
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<Reply> {
    this.reply = { content, id: randomStr(7), owner: ownerId };
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
    this.reply = {
      content: '',
      id: '',
      owner: '',
    };
    this.masterId = '';
  }
}
