import { IReplies } from '~/infrastructure/contracts/T-replies';

export class Replies {
  constructor(private readonly repository: IReplies) {}

  async select(id: string): Promise<Reply | undefined> {
    return await this.repository.select(id);
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<Reply> {
    return await this.repository.create(ownerId, masterId, content);
  }

  async update(replyId: string, content: string): Promise<Reply> {
    return await this.repository.update(replyId, content);
  }

  async delete(replyId: string): Promise<void> {
    return await this.repository.delete(replyId);
  }
}
