import { IReplies, RepliesOptions } from '~/infrastructure/contracts/T-replies';

export class Replies {
  constructor(private readonly repository: IReplies) {}

  select(
    id: string,
    options: RepliesOptions = { all: false },
  ): Promise<(Reply & { masterId: string }) | undefined> {
    return this.repository.select(id, options) as Promise<
      (Reply & { masterId: string }) | undefined
    >;
  }

  create(ownerId: string, masterId: string, content: string): Promise<Reply> {
    return this.repository.create(ownerId, masterId, content) as Promise<Reply>;
  }

  update(replyId: string, content: string): Promise<Reply> {
    return this.repository.update(replyId, content) as Promise<Reply>;
  }

  delete(replyId: string): Promise<void> {
    return this.repository.delete(replyId) as Promise<void>;
  }
}
