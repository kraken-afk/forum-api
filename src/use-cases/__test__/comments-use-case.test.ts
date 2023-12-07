import { ClientError } from '~/commons/errors/client-error';
import { ForbiddenError } from '~/commons/errors/forbidden-error';
import { NotFoundError } from '~/commons/errors/not-found-error';
import { UnauthorizedError } from '~/commons/errors/unauthorized-error';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import { CommentsUseCase } from '~/use-cases/comments';

describe('Comments use-case test suite', () => {
  describe('Create comment test suite', () => {
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
            likes: [],
          };
        },
      }));
      const Comments = new CommentsUseCase({
        comments: new MockedCommentDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });
      const comment = await Comments.createComment('jhondoe', 'thread-xxx-1', {
        content: 'this is a comment',
      });

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
            likes: [],
          };
        },
      }));
      const Comments = new CommentsUseCase({
        comments: new MockedCommentDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Comments.createComment(
            'jhondoe',
            'thread-xxx-1',
            // @ts-ignore
            { content: {} },
          ),
      ).rejects.toThrow(ClientError);
    });

    test('Create comment unauthorized user', async () => {
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
            likes: [],
          };
        },
      }));
      const Comments = new CommentsUseCase({
        comments: new MockedCommentDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Comments.createComment(
            'joko',
            'thread-xxx-1',
            // @ts-ignore
            { content: 'this is comment' },
          ),
      ).rejects.toThrow(UnauthorizedError);
    });

    test('Create comment with nonexistence thread', async () => {
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
            likes: [],
          };
        },
      }));
      const Comments = new CommentsUseCase({
        comments: new MockedCommentDomain(),
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(
        async () =>
          await Comments.createComment(
            'jhondoe',
            'Kratos',
            // @ts-ignore
            { content: 'this is comment' },
          ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('Delete comment test suite', () => {
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
            likes: [],
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
      const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({}));
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await commentModel.select('comment-xxx')).toBeTruthy();

      await Comments.deleteComment('comment-xxx', 'jhondoe');

      expect(await commentModel.select('comment-xxx')).toBeFalsy();
    });

    test('Delete comment test case with unauthorized user', async () => {
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
            likes: [],
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
      const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({}));
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await commentModel.select('comment-xxx')).toBeTruthy();
      expect(
        async () => await Comments.deleteComment('comment-xxx', 'joko'),
      ).rejects.toThrow(UnauthorizedError);
    });

    test('Delete comment test case with nonexistence comment', async () => {
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
            likes: [],
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
      const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({}));
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await commentModel.select('comment-xxx')).toBeTruthy();
      expect(
        async () => await Comments.deleteComment('xxx', 'jhondoe'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Delete comment test case with different owner', async () => {
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
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        let comments: Array<TComment & { isDeleted: boolean }> = [
          {
            content: 'this is a comment',
            id: 'comment-xxx',
            date: new Date(),
            owner: 'jhondoe',
            isDeleted: false,
            likes: [],
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
      const MockedThreadDomain = <jest.Mock<ThreadsDomain>>jest.fn(() => ({}));
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      expect(await commentModel.select('comment-xxx')).toBeTruthy();
      expect(
        async () => await Comments.deleteComment('comment-xxx', 'joe'),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Like comment test suite', () => {
    test('Like comment test case', async () => {
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
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is a comment',
            id: 'comment-xxx',
            date: new Date(),
            owner: 'jhondoe',
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
          async like(userId: string, commentId: string): Promise<TComment> {
            const index = comments.findIndex(e => e.id === commentId);

            comments[index].likes.push(userId);

            return comments[index];
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
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      const comment = await commentModel.select('comment-xxx');

      expect(comment).toHaveProperty('likes');
      expect(Array.isArray(comment?.likes)).toBeTruthy();
      expect(comment?.likes.length).toEqual(0);

      const commentAfterLike = await Comments.likeComment(
        'jhondoe',
        comment!.id,
        comment!.masterId,
      );

      expect(commentAfterLike).toHaveProperty('likeCount', 1);
    });

    test('Like comment test case with nonexistence thread', async () => {
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
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is a comment',
            id: 'comment-xxx',
            date: new Date(),
            owner: 'jhondoe',
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
          async like(userId: string, commentId: string): Promise<TComment> {
            const index = comments.findIndex(e => e.id === commentId);

            comments[index].likes.push(userId);

            return comments[index];
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
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      const comment = await commentModel.select('comment-xxx');

      expect(comment).toHaveProperty('likes');
      expect(Array.isArray(comment?.likes)).toBeTruthy();
      expect(comment?.likes.length).toEqual(0);

      expect(
        async () => await Comments.likeComment('jhondoe', comment!.id, 'xxx'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Like comment test case with nonexistence comment', async () => {
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
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is a comment',
            id: 'comment-xxx',
            date: new Date(),
            owner: 'jhondoe',
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
          async like(userId: string, commentId: string): Promise<TComment> {
            const index = comments.findIndex(e => e.id === commentId);

            comments[index].likes.push(userId);

            return comments[index];
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
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      const comment = await commentModel.select('comment-xxx');

      expect(comment).toHaveProperty('likes');
      expect(Array.isArray(comment?.likes)).toBeTruthy();
      expect(comment?.likes.length).toEqual(0);

      expect(
        async () =>
          await Comments.likeComment('jhondoe', 'xxx', 'thread-xxx-1'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Like comment test case with nonexistence comment', async () => {
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
      const MockedCommentDomain = <jest.Mock<CommentsDomain>>jest.fn(() => {
        const comments: Array<
          TComment & { isDeleted: boolean; masterId: string }
        > = [
          {
            content: 'this is a comment',
            id: 'comment-xxx',
            date: new Date(),
            owner: 'jhondoe',
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
          async like(userId: string, commentId: string): Promise<TComment> {
            const index = comments.findIndex(e => e.id === commentId);

            comments[index].likes.push(userId);

            return comments[index];
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
      const commentModel = new MockedCommentDomain();
      const Comments = new CommentsUseCase({
        comments: commentModel,
        threads: new MockedThreadDomain(),
        users: new MockedUserDomain(),
      });

      const comment = await commentModel.select('comment-xxx');

      expect(comment).toHaveProperty('likes');
      expect(Array.isArray(comment?.likes)).toBeTruthy();
      expect(comment?.likes.length).toEqual(0);

      expect(
        async () =>
          await Comments.likeComment('xxx', comment!.id, 'thread-xxx-1'),
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
