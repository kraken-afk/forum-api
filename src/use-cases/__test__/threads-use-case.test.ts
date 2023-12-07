import { ClientError } from '~/commons/errors/client-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import { ThreadsUseCase } from '~/use-cases/threads';

describe('Threads use-case test suite', () => {
  test('Create thread test case', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Greg',
          username: 'greg',
        },
      ];

      return {
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });
    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({
      async create(
        title,
        _body,
        ownerId,
      ): Promise<{ id: string; title: string; owner: string }> {
        return { id: 'thread-xxx-1', owner: ownerId, title: title };
      },
    }));

    const Threads = new ThreadsUseCase({
      threads: new MockedThreadDomain(),
      users: new MockedUserDomain(),
    });

    const newThread = await Threads.createThread('greg', {
      title: 'title 1',
      body: 'body 1',
    });

    expect(newThread).toHaveProperty('id', 'thread-xxx-1');
    expect(newThread).toHaveProperty('title', 'title 1');
    expect(newThread).toHaveProperty('owner', 'user-xxx-1');

    expect(
      async () =>
        await Threads.createThread('Jhon', {
          title: 'title 1',
          body: 'body 1',
        }),
    ).rejects.toThrow(UnauthorizedError);
  });

  test('Create thread test case with bad payload', async () => {
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
      const users: User[] = [
        {
          id: 'user-xxx-1',
          fullname: 'Greg',
          username: 'greg',
        },
      ];

      return {
        async select(username): Promise<User | undefined> {
          return users.find(user => user.username === username);
        },
      };
    });
    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({
      async create(
        title,
        _body,
        ownerId,
      ): Promise<{ id: string; title: string; owner: string }> {
        return { id: 'thread-xxx-1', owner: ownerId, title: title };
      },
    }));

    const Threads = new ThreadsUseCase({
      threads: new MockedThreadDomain(),
      users: new MockedUserDomain(),
    });

    expect(
      async () =>
        await Threads.createThread(
          'greg',
          // @ts-ignore
          { title: [], body: '' },
        ),
    ).rejects.toThrow(ClientError);
  });

  test('Get thread with comments', async () => {
    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => {
      const threads: ThreadsDetail[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          username: 'jhondoe',
          comments: [
            {
              id: 'comment-xxx',
              username: 'romeo',
              content: 'this is comment',
              date: new Date(),
              isDeleted: false,
              likes: [],
              replies: [
                {
                  id: 'reply-xxx',
                  content: 'this is reply',
                  date: new Date(),
                  username: 'sukuna',
                  isDeleted: false,
                },
              ],
            },
          ],
        },
      ];

      return {
        async getThreadsWithComments(
          threadId,
        ): Promise<ThreadsDetail | undefined> {
          return threads.find(thread => thread.id === threadId);
        },
      };
    });
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => ({}));
    const Threads = new ThreadsUseCase({
      threads: new MockedThreadDomain(),
      users: new MockedUserDomain(),
    });
    const thread = await Threads.getThreadDetail('thread-xxx');

    expect(thread).toHaveProperty('id', 'thread-xxx');
    expect(thread).toHaveProperty('title', 'title 1');
    expect(thread).toHaveProperty('body', 'body 1');
    expect(thread).toHaveProperty('username', 'jhondoe');
    expect(thread).toHaveProperty('date');
    expect(thread).toHaveProperty('comments');

    expect(thread?.date).toBeInstanceOf(Date);
    expect(thread?.comments).toBeInstanceOf(Array);

    expect(thread?.comments[0]).toHaveProperty('id', 'comment-xxx');
    expect(thread?.comments[0]).toHaveProperty('username', 'romeo');
    expect(thread?.comments[0]).toHaveProperty('content', 'this is comment');
    expect(thread?.comments[0]).toHaveProperty('date');
    expect(thread?.comments[0]).toHaveProperty('replies');

    expect(thread?.comments[0].date).toBeInstanceOf(Date);
    expect(thread?.comments[0].replies).toBeInstanceOf(Array);

    expect(thread?.comments[0].replies[0]).toHaveProperty('id', 'reply-xxx');
    expect(thread?.comments[0].replies[0]).toHaveProperty('username', 'sukuna');
    expect(thread?.comments[0].replies[0]).toHaveProperty(
      'content',
      'this is reply',
    );
    expect(thread?.comments[0].replies[0]).toHaveProperty('date');

    expect(thread?.comments[0].replies[0].date).toBeInstanceOf(Date);
  });

  test('Get thread with deleted comments', async () => {
    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => {
      const threads: ThreadsDetail[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          username: 'jhondoe',
          comments: [
            {
              id: 'comment-xxx',
              username: 'romeo',
              content: 'this is comment',
              date: new Date(),
              isDeleted: true,
              likes: [],
              replies: [
                {
                  id: 'reply-xxx',
                  content: 'this is reply',
                  date: new Date(),
                  username: 'sukuna',
                  isDeleted: true,
                },
              ],
            },
          ],
        },
      ];

      return {
        async getThreadsWithComments(
          threadId,
        ): Promise<ThreadsDetail | undefined> {
          return threads.find(thread => thread.id === threadId);
        },
      };
    });
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => ({}));
    const Threads = new ThreadsUseCase({
      threads: new MockedThreadDomain(),
      users: new MockedUserDomain(),
    });
    const thread = await Threads.getThreadDetail('thread-xxx');

    expect(thread).toHaveProperty('id', 'thread-xxx');
    expect(thread).toHaveProperty('title', 'title 1');
    expect(thread).toHaveProperty('body', 'body 1');
    expect(thread).toHaveProperty('username', 'jhondoe');
    expect(thread).toHaveProperty('date');
    expect(thread).toHaveProperty('comments');

    expect(thread?.date).toBeInstanceOf(Date);
    expect(thread?.comments).toBeInstanceOf(Array);

    expect(thread?.comments[0]).toHaveProperty('id', 'comment-xxx');
    expect(thread?.comments[0]).toHaveProperty('username', 'romeo');
    expect(thread?.comments[0]).toHaveProperty(
      'content',
      '**komentar telah dihapus**',
    );
    expect(thread?.comments[0]).toHaveProperty('date');
    expect(thread?.comments[0]).toHaveProperty('replies');

    expect(thread?.comments[0].date).toBeInstanceOf(Date);
    expect(thread?.comments[0].replies).toBeInstanceOf(Array);

    expect(thread?.comments[0].replies[0]).toHaveProperty('id', 'reply-xxx');
    expect(thread?.comments[0].replies[0]).toHaveProperty('username', 'sukuna');
    expect(thread?.comments[0].replies[0]).toHaveProperty(
      'content',
      '**balasan telah dihapus**',
    );
    expect(thread?.comments[0].replies[0]).toHaveProperty('date');

    expect(thread?.comments[0].replies[0].date).toBeInstanceOf(Date);
  });

  test("Get thread with comments that didn't exist", async () => {
    const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => {
      const threads: ThreadsDetail[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          username: 'jhondoe',
          comments: [
            {
              id: 'comment-xxx',
              username: 'romeo',
              content: 'this is comment',
              date: new Date(),
              isDeleted: false,
              likes: [],
              replies: [
                {
                  id: 'reply-xxx',
                  content: 'this is reply',
                  date: new Date(),
                  username: 'sukuna',
                  isDeleted: false,
                },
              ],
            },
          ],
        },
      ];

      return {
        async getThreadsWithComments(
          threadId,
        ): Promise<ThreadsDetail | undefined> {
          return threads.find(thread => thread.id === threadId);
        },
      };
    });
    const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => ({}));
    const Threads = new ThreadsUseCase({
      threads: new MockedThreadDomain(),
      users: new MockedUserDomain(),
    });

    expect(async () => await Threads.getThreadDetail('xxx')).rejects.toThrow(
      NotFoundError,
    );
  });
});
