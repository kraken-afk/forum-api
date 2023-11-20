import { ClientError } from '~/commons/errors/client-error';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import { Comments } from '~/use-cases/comments';

describe('Comments use-case test suite', () => {
  test('Create comment test case', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Jhon doe',
          username: 'jhondoe',
        },
      ];

      return {
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });

    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => {
      const threads: Thread[] = [
        {
          id: 'thread-xxx-1',
          body: 'this is body',
          date: new Date(),
          owner: 'user-xxx-1',
          title: 'this is title',
        },
      ];
      return {
        async create(
          title,
          body,
          ownerId,
        ): Promise<{ id: string; title: string; owner: string }> {
          const thread: Thread = {
            id: 'thread-xxx-1',
            owner: ownerId,
            title: title,
            body: body,
            date: new Date(),
          };

          threads.push(thread);

          return thread;
        },
        async select(threadId): Promise<Thread | undefined> {
          return threads.find(thread => thread.id === threadId);
        },
      };
    });
    const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => ({
      async create(
        ownerId: string,
        _masterId: string,
        content: string,
      ): Promise<TComment> {
        return {
          id: 'comment-xxx-1',
          content: content,
          date: new Date(),
          owner: ownerId,
        };
      },
    }));

    const comment = await Comments.createComment(
      'jhondoe',
      'thread-xxx-1',
      { content: 'this is a comment' },
      {
        comments: new MockedCommentDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      },
    );

    expect(comment).toHaveProperty('id', 'comment-xxx-1');
    expect(comment).toHaveProperty('content', 'this is a comment');
    expect(comment).toHaveProperty('owner', 'user-xxx-1');
    expect(comment).toHaveProperty('date');
    expect(comment.date).toBeInstanceOf(Date);
  });

  test('Create comment with bad payload test case', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Jhon doe',
          username: 'jhondoe',
        },
      ];

      return {
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });

    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => {
      const threads: Thread[] = [
        {
          id: 'thread-xxx-1',
          body: 'this is body',
          date: new Date(),
          owner: 'user-xxx-1',
          title: 'this is title',
        },
      ];
      return {
        async create(
          title,
          body,
          ownerId,
        ): Promise<{ id: string; title: string; owner: string }> {
          const thread: Thread = {
            id: 'thread-xxx-1',
            owner: ownerId,
            title: title,
            body: body,
            date: new Date(),
          };

          threads.push(thread);

          return thread;
        },
        async select(threadId): Promise<Thread | undefined> {
          return threads.find(thread => thread.id === threadId);
        },
      };
    });
    const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => ({
      async create(
        ownerId: string,
        _masterId: string,
        content: string,
      ): Promise<TComment> {
        return {
          id: 'comment-xxx-1',
          content: content,
          date: new Date(),
          owner: ownerId,
        };
      },
    }));

    expect(
      async () =>
        await Comments.createComment(
          'jhondoe',
          'thread-xxx-1',
          // @ts-ignore
          { content: {} },
          {
            comments: new MockedCommentDomain(),
            threads: new MockedThreadDomain(),
            users: new MockedUserDomain(),
          },
        ),
    ).rejects.toThrow(ClientError);
  });

  test('Delete comment test case', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Jhon doe',
          username: 'jhondoe',
        },
      ];

      return {
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });
    const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
      let comments: Array<TComment & { isDeleted: boolean }> = [
        {
          content: 'this is a comment',
          id: 'comment-xxx',
          date: new Date(),
          owner: 'jhondoe',
          isDeleted: false,
        },
      ];
      return {
        async delete(commentId: string): Promise<void> {
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

    const commentModel = new MockedCommentDomain();

    expect(await commentModel.select('comment-xxx')).toBeTruthy();

    await Comments.deleteComment('comment-xxx', 'jhondoe', {
      comments: commentModel,
      users: new MockedUserDomain(),
    });

    expect(await commentModel.select('comment-xxx')).toBeFalsy();
  });
});
