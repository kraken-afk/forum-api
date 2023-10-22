import { IComments } from '~/infrastructure/contracts/T-comments';

export class Comments {
  constructor(private readonly repository: IComments) {}

  async select(id: string): Promise<TComment | undefined> {
    return await this.repository.select(id);
  }

  async create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<TComment> {
    return await this.repository.create(ownerId, masterId, content);
  }

  async update(
    commentId: string,
    content: string,
  ): Promise<TComment & { editedAt: Date }> {
    return await this.repository.update(commentId, content);
  }

  async delete(commentId: string): Promise<void> {
    return await this.repository.delete(commentId);
  }
}
