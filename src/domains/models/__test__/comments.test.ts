import { Comments } from '~/domains/models/comments';
import { IComments } from '~/infrastructure/contracts/T-comments';

describe('Comments model test suits', () => {
  test('Method check', () => {
    const MockedCommentsRepository = <jest.Mock<IComments>>jest.fn(() => ({}));
    const model = new Comments(new MockedCommentsRepository());

    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Create comment test case', async () => {
    const MockedCommentsRepository = <jest.Mock<IComments>>jest.fn(() => ({
      async create(ownerId, masterId, content): Promise<TComment> {
        const threads = ['thread-xxx-1', 'thread-xxx-2'];
        if (!threads.includes(masterId))
          throw new Error("Master doesn't exist");

        return {
          id: 'comment-xxx',
          content: content,
          owner: ownerId,
          date: new Date(),
        };
      },
    }));
    const model = new Comments(new MockedCommentsRepository());
    const comment = await model.create(
      'user-xxx',
      'thread-xxx-1',
      'this is comment',
    );

    expect(comment).toHaveProperty('id', 'comment-xxx');
    expect(comment).toHaveProperty('content', 'this is comment');
    expect(comment).toHaveProperty('owner', 'user-xxx');
    expect(comment).toHaveProperty('date');
    expect(comment.date).toBeInstanceOf(Date);
  });

  test('Select comment test case', async () => {
    const MockedCommentsRepository = <jest.Mock<IComments>>jest.fn(() => {
      const comments = [
        {
          id: 'comment-xxx-1',
          content: 'this is comment',
          owner: 'user-1',
          date: new Date(),
          isDeleted: false,
        },
        {
          id: 'comment-xxx-2',
          content: 'this is comment',
          owner: 'user-2',
          date: new Date(),
          isDeleted: true,
        },
      ];

      return {
        async select(id, options): Promise<TComment | undefined> {
          return comments.find(comment => {
            if (options?.all) {
              return comment.id === id;
            } else {
              return comment.id === id && !comment.isDeleted;
            }
          });
        },
      };
    });
    const model = new Comments(new MockedCommentsRepository());
    const selectedComment = await model.select('comment-xxx-1');

    expect(selectedComment).toHaveProperty('id', 'comment-xxx-1');
    expect(selectedComment).toHaveProperty('content', 'this is comment');
    expect(selectedComment).toHaveProperty('owner', 'user-1');
    expect(selectedComment).toHaveProperty('date');
    expect(selectedComment?.date).toBeInstanceOf(Date);
  });

  test('Update comment test case', async () => {
    const MockedCommentsRepository = <jest.Mock<IComments>>jest.fn(() => {
      const comments = [
        {
          id: 'comment-xxx-1',
          content: 'this is comment',
          owner: 'user-1',
          isDeleted: false,
        },
        {
          id: 'comment-xxx-2',
          content: 'this is comment',
          owner: 'user-2',
          isDeleted: true,
        },
      ];

      return {
        async select(id, options) {
          return comments.find(comment => {
            if (options?.all) {
              return comment.id === id;
            } else {
              return comment.id === id && !comment.isDeleted;
            }
          });
        },
        async update(id, content): Promise<Reply> {
          const index = comments.findIndex(reply => reply.id === id);
          if (index === -1) throw new Error("Reply doesn't exist");

          comments[index].content = content;
          return comments[index];
        },
      };
    });
    const model = new Comments(new MockedCommentsRepository());
    const selectedReply = await model.select('comment-xxx-1');

    expect(selectedReply).toHaveProperty('id', 'comment-xxx-1');
    expect(selectedReply).toHaveProperty('content', 'this is comment');
    expect(selectedReply).toHaveProperty('owner', 'user-1');

    const updatedReply = await model.update('comment-xxx-1', 'updated comment');

    expect(updatedReply).toHaveProperty('id', 'comment-xxx-1');
    expect(updatedReply).toHaveProperty('content', 'updated comment');
    expect(updatedReply).toHaveProperty('owner', 'user-1');
  });

  test('Delete Comment', async () => {
    const MockedCommentsRepository = <jest.Mock<IComments>>jest.fn(() => {
      let comments = [
        {
          id: 'comment-xxx-1',
          content: 'this is comment',
          owner: 'user-1',
          date: new Date(),
          isDeleted: false,
        },
        {
          id: 'comment-xxx-2',
          content: 'this is comment',
          owner: 'user-2',
          date: new Date(),
          isDeleted: true,
        },
      ];

      return {
        async delete(commentId): Promise<void> {
          comments = comments.filter(comment => comment.id !== commentId);
        },
        async select(id, options) {
          return comments.find(comment => {
            if (options?.all) {
              return comment.id === id;
            } else {
              return comment.id === id && !comment.isDeleted;
            }
          });
        },
      };
    });
    const model = new Comments(new MockedCommentsRepository());

    await model.delete('comment-xxx-1');

    expect(await model.select('comment-xxx-1')).toBe(undefined);
  });
});
