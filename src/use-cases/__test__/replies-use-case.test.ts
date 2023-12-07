import { ClientError } from '~/commons/errors/client-error';
import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Replies as RepliesDomain } from '~/domains/models/replies';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import { RepliesUseCase } from '~/use-cases/replies';

describe('Replies use-case test suite', () => {
  describe('Create reply test suite', () => {
    test('Create reply test case', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      const reply = await Replies.createReply(
        'jhondoe',
        { commentId: 'comment-xxx-1', threadId: 'thread-xxx-1' },
        { content: 'this is reply' },
      );

      expect(reply).toHaveProperty('id', 'reply-xxx');
      expect(reply).toHaveProperty('content', 'this is reply');
      expect(reply).toHaveProperty('owner', 'user-xxx-1');
    });

    test('Create reply with bad payload test case', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<TComment & { isDeleted: boolean }> = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Replies.createReply(
            'jhondoe',
            { commentId: 'comment-xxx-1', threadId: 'thread-xxx-1' },
            // @ts-ignore
            { content: {} },
          ),
      ).rejects.toThrow(ClientError);
    });

    test('Create reply test case with unauthorized user', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Replies.createReply(
            'xxx',
            { commentId: 'comment-xxx-1', threadId: 'thread-xxx-1' },
            { content: 'this is reply' },
          ),
      ).rejects.toThrow(UnauthorizedError);
    });

    test('Create reply test case with nonexistence thread', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Replies.createReply(
            'jhondoe',
            { commentId: 'comment-xxx-1', threadId: 'xxx' },
            { content: 'this is reply' },
          ),
      ).rejects.toThrow(NotFoundError);
    });

    test('Create reply test case with nonexistence comment', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Replies.createReply(
            'jhondoe',
            { commentId: 'xxx', threadId: 'thread-xxx-1' },
            { content: 'this is reply' },
          ),
      ).rejects.toThrow(NotFoundError);
    });

    test("Create reply test case with comment that didn't exist in the thread", async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-2',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => ({
        async create(
          ownerId: string,
          _masterId: string,
          content: string,
        ): Promise<Reply> {
          return {
            id: 'reply-xxx',
            content: content,
            owner: ownerId,
          };
        },
      }));
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: new MockedReplyDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Replies.createReply(
            'jhondoe',
            { commentId: 'comment-xxx-1', threadId: 'thread-xxx-1' },
            { content: 'this is reply' },
          ),
      ).rejects.toThrow(ClientError);
    });
  });

  describe('Delete reply test suite', () => {
    test('Delete reply test case', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();

      await Replies.deleteReply('reply-xxx', 'jhondoe', {
        commentId: 'comment-xxx-1',
        threadId: 'thread-xxx-1',
      });
      expect(await replyDomain.select('reply-xxx')).toBeFalsy();
    });

    test('Delete reply with unauthorized user', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'xxx', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(UnauthorizedError);
    });

    test('Delete reply with nonexistence thread', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'jhondoe', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-2',
          }),
      ).rejects.toThrow(NotFoundError);
    });

    test('Delete reply with nonexistence comment', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'jhondoe', {
            commentId: 'comment-xxx-2',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(NotFoundError);
    });

    test('Delete reply with nonexistence reply', async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('xxx', 'jhondoe', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(NotFoundError);
    });

    test("Delete reply with comment that didn't exist in the thread", async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-2',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });

      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'jhondoe', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(ClientError);
    });

    test("Delete reply with reply that didn't exist in the comment", async () => {
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-2',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });

      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'jhondoe', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(ClientError);
    });

    test('Delete reply with different owner', async () => {
      const MockedUserDomain = <jest.Mock<UsersDomain>>jest.fn(() => {
        const users: User[] = [
          {
            id: 'user-xxx-1',
            fullname: 'Jhon doe',
            username: 'jhondoe',
          },
          {
            id: 'user-xxx-2',
            fullname: 'Joe',
            username: 'joe',
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
          async select(threadId): Promise<Thread | undefined> {
            return threads.find(thread => thread.id === threadId);
          },
        };
      });
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is content',
            date: new Date(),
            id: 'comment-xxx-1',
            owner: 'user-xxx-1',
            isDeleted: false,
            masterId: 'thread-xxx-1',
            likes: [],
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
        };
      });
      const MockedReplyDomain = <jest.Mock<RepliesDomain>>jest.fn(() => {
        let replies: Array<Reply & { masterId: string; isDeleted: boolean }> = [
          {
            content: 'this is reply',
            id: 'reply-xxx',
            owner: 'user-xxx-1',
            masterId: 'comment-xxx-1',
            isDeleted: false,
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
          async delete(replyId): Promise<void> {
            replies = replies.filter(reply => reply.id !== replyId);
          },
        };
      });
      const replyDomain = new MockedReplyDomain();
      const Replies = new RepliesUseCase({
        comments: new MockedCommentDomain(),
        replies: replyDomain,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await replyDomain.select('reply-xxx')).toBeTruthy();
      expect(
        async () =>
          await Replies.deleteReply('reply-xxx', 'joe', {
            commentId: 'comment-xxx-1',
            threadId: 'thread-xxx-1',
          }),
      ).rejects.toThrow(ForbiddenError);
    });
  });
});
