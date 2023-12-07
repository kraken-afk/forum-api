import {
  CommentOption,
  IComments,
} from '~/infrastructure/contracts/T-comments';

export class Comments {
  constructor(private readonly repository: IComments) {}

  select(
    id: string,
    options: CommentOption = { all: false },
  ): Promise<(TComment & { masterId: string }) | undefined> {
    return this.repository.select(id, options) as Promise<
      (TComment & { masterId: string }) | undefined
    >;
  }

  create(
    ownerId: string,
    masterId: string,
    content: string,
  ): Promise<TComment> {
    return this.repository.create(
      ownerId,
      masterId,
      content,
    ) as Promise<TComment>;
  }

  update(
    commentId: string,
    content: string,
  ): Promise<TComment & { editedAt: Date }> {
    return this.repository.update(commentId, content) as Promise<
      TComment & { editedAt: Date }
    >;
  }

  delete(commentId: string): Promise<void> {
    return this.repository.delete(commentId) as Promise<void>;
  }

  like(userId: string, commentId: string): Promise<TComment> {
    return this.repository.like(userId, commentId) as Promise<TComment>;
  }
}
