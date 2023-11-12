import {
  CommentOption,
  IComments,
} from '~/infrastructure/contracts/T-comments';

export class Comments {
  constructor(private readonly repository: IComments) {}

  async select(
    id: string,
    options: CommentOption = { all: false },
  ): Promise<(TComment & { masterId: string }) | undefined> {
    return await this.repository.select(id, options);
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
