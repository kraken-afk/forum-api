import { Threads } from '~/domains/models/threads';
import type { Ithreads } from '~/infrastructure/contracts/T-threads';

describe('Threads repository test suite', () => {
  test('Method checks', () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => ({}));
    const model = new Threads(new MockedTreadRepository());

    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Get thread with comments', async () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => {
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
              replies: [
                {
                  id: 'reply-xxx',
                  content: 'this is reply',
                  date: new Date(),
                  username: 'sukuna',
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
    const model = new Threads(new MockedTreadRepository());
    const thread = await model.getThreadsWithComments('thread-xxx');

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

  test('Create thread test case', async () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => ({
      async create(
        title,
        _body,
        ownerId,
      ): Promise<{
        id: string;
        title: string;
        owner: string;
      }> {
        const user = {
          fullname: 'Jhon doe',
          username: 'jhondoe',
          id: 'jhnd11',
        };

        if (ownerId !== user.id) throw new Error("user didn't exist");
        return {
          id: 'thread-xxx',
          owner: user.id,
          title: title,
        };
      },
    }));
    const model = new Threads(new MockedTreadRepository());
    const thread = await model.create('title 1', 'body 1', 'jhnd11');

    expect(thread).toHaveProperty('id', 'thread-xxx');
    expect(thread).toHaveProperty('owner', 'jhnd11');
    expect(thread).toHaveProperty('title', 'title 1');
  });

  test('Select thread by id test case', async () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => {
      const threads: Thread[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          owner: 'user-xxx',
        },
      ];

      return {
        async select(id): Promise<Thread | undefined> {
          return threads.find(thread => thread.id === id);
        },
      };
    });
    const model = new Threads(new MockedTreadRepository());
    const selectedThread = await model.select('thread-xxx');

    expect(selectedThread).toHaveProperty('id', 'thread-xxx');
    expect(selectedThread).toHaveProperty('title', 'title 1');
    expect(selectedThread).toHaveProperty('body', 'body 1');
    expect(selectedThread).toHaveProperty('owner', 'user-xxx');

    const notExistThread = await model.select('xxx');
    expect(notExistThread).toBe(undefined);
  });

  test('Update thread test case', async () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => {
      const threads: Thread[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          owner: 'user-xxx',
        },
      ];

      return {
        async select(id): Promise<Thread | undefined> {
          return threads.find(thread => thread.id === id);
        },
        async update(id, payload): Promise<Thread> {
          const index = threads.findIndex(thread => thread.id === id);
          if (index === -1) throw new Error('thread not found');

          threads[index].body = payload.body ?? threads[index].body;
          threads[index].title = payload.title ?? threads[index].title;

          return threads[index];
        },
      };
    });
    const model = new Threads(new MockedTreadRepository());
    const id = 'thread-xxx';
    const selectedThread = await model.select(id);

    expect(selectedThread).toHaveProperty('title', 'title 1');
    expect(selectedThread).toHaveProperty('body', 'body 1');
    expect(selectedThread).toHaveProperty('id', id);
    expect(selectedThread).toHaveProperty('owner', 'user-xxx');

    const updatedThread = await model.update(id, { title: 'new title' });

    expect(updatedThread).toHaveProperty('title', 'new title');
    expect(updatedThread).toHaveProperty('body', 'body 1');
    expect(updatedThread).toHaveProperty('id', id);
    expect(updatedThread).toHaveProperty('owner', 'user-xxx');
  });

  test('Delete thread test case', async () => {
    const MockedTreadRepository = <jest.Mock<Ithreads>>jest.fn(() => {
      let threads: Thread[] = [
        {
          id: 'thread-xxx',
          title: 'title 1',
          body: 'body 1',
          date: new Date(),
          owner: 'user-xxx',
        },
      ];

      return {
        async select(id): Promise<Thread | undefined> {
          return threads.find(thread => thread.id === id);
        },
        async delete(id): Promise<void> {
          threads = threads.filter(thread => thread.id !== id);
        },
      };
    });
    const model = new Threads(new MockedTreadRepository());
    const id = 'thread-xxx';
    const selectedThread = await model.select(id);

    expect(selectedThread).toHaveProperty('title', 'title 1');
    expect(selectedThread).toHaveProperty('body', 'body 1');
    expect(selectedThread).toHaveProperty('id', id);
    expect(selectedThread).toHaveProperty('owner', 'user-xxx');

    await model.delete(id);

    expect(await model.select(id)).toBe(undefined);
  });
});
