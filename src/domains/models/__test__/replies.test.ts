import { Replies } from '~/domains/models/replies';
import { IReplies } from '~/infrastructure/contracts/T-replies';

describe('Replies repository test suits', () => {
  test('Method check', () => {
    const MockedReplyRepository = <jest.Mock<IReplies>>jest.fn(() => ({}));
    const model = new Replies(new MockedReplyRepository());

    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Create reply test case', async () => {
    const MockedReplyRepository = <jest.Mock<IReplies>>jest.fn(() => {
      const comments = ['comment-xxx-1', 'comment-xxx-2'];

      return {
        async create(ownerId, masterId, content): Promise<Reply> {
          if (!comments.includes(masterId)) throw new Error('master not found');
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      };
    });
    const model = new Replies(new MockedReplyRepository());
    const reply = await model.create(
      'user-xxx',
      'comment-xxx-1',
      'this is reply',
    );

    expect(reply).toHaveProperty('id', 'reply-xxx');
    expect(reply).toHaveProperty('content', 'this is reply');
    expect(reply).toHaveProperty('owner', 'user-xxx');
  });

  test('Select reply test case', async () => {
    const MockedReplyRepository = <jest.Mock<IReplies>>jest.fn(() => {
      const replies = [
        {
          id: 'reply-xxx-1',
          content: 'this is reply',
          owner: 'user-1',
          isDeleted: false,
        },
        {
          id: 'reply-xxx-2',
          content: 'this is reply',
          owner: 'user-2',
          isDeleted: true,
        },
      ];

      return {
        async select(id, options) {
          return replies.find(reply => {
            if (options?.all) {
              return reply.id === id;
            } else {
              return reply.id === id && !reply.isDeleted;
            }
          });
        },
      };
    });
    const model = new Replies(new MockedReplyRepository());
    const selectedReply = await model.select('reply-xxx-1');

    expect(selectedReply).toHaveProperty('id', 'reply-xxx-1');
    expect(selectedReply).toHaveProperty('content', 'this is reply');
    expect(selectedReply).toHaveProperty('owner', 'user-1');
  });

  test('Update reply test case', async () => {
    const MockedReplyRepository = <jest.Mock<IReplies>>jest.fn(() => {
      const replies = [
        {
          id: 'reply-xxx-1',
          content: 'this is reply',
          owner: 'user-1',
          isDeleted: false,
        },
        {
          id: 'reply-xxx-2',
          content: 'this is reply',
          owner: 'user-2',
          isDeleted: true,
        },
      ];

      return {
        async select(id, options) {
          return replies.find(reply => {
            if (options?.all) {
              return reply.id === id;
            } else {
              return reply.id === id && !reply.isDeleted;
            }
          });
        },
        async update(id, content): Promise<Reply> {
          const index = replies.findIndex(reply => reply.id === id);
          if (index === -1) throw new Error("Reply doesn't exist");

          replies[index].content = content;
          return replies[index];
        },
      };
    });
    const model = new Replies(new MockedReplyRepository());
    const selectedReply = await model.select('reply-xxx-1');

    expect(selectedReply).toHaveProperty('id', 'reply-xxx-1');
    expect(selectedReply).toHaveProperty('content', 'this is reply');
    expect(selectedReply).toHaveProperty('owner', 'user-1');

    const updatedReply = await model.update('reply-xxx-1', 'updated reply');

    expect(updatedReply).toHaveProperty('id', 'reply-xxx-1');
    expect(updatedReply).toHaveProperty('content', 'updated reply');
    expect(updatedReply).toHaveProperty('owner', 'user-1');
  });

  test('Delete reply', async () => {
    const MockedReplyRepository = <jest.Mock<IReplies>>jest.fn(() => {
      let replies = [
        {
          id: 'reply-xxx-1',
          content: 'this is reply',
          owner: 'user-1',
          isDeleted: false,
        },
        {
          id: 'reply-xxx-2',
          content: 'this is reply',
          owner: 'user-2',
          isDeleted: true,
        },
      ];

      return {
        async delete(replyId): Promise<void> {
          replies = replies.filter(reply => reply.id !== replyId);
        },
        async select(id, options) {
          return replies.find(reply => {
            if (options?.all) {
              return reply.id === id;
            } else {
              return reply.id === id && !reply.isDeleted;
            }
          });
        },
      };
    });
    const model = new Replies(new MockedReplyRepository());

    await model.delete('reply-xxx-1');

    expect(await model.select('reply-xxx-1')).toBe(undefined);
  });
});
