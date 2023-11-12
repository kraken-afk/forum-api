import { db } from '@test/helpers/db';
import { ClientError } from '~/commons/errors/client-error';
import { randomStr } from '~/commons/libs/random-str';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Replies as RepliesDomain } from '~/domains/models/replies';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { CommentsRepository } from '~/infrastructure/repository/comments-repository';
import { RepliesRepository } from '~/infrastructure/repository/replies-repository';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';
import { UsersRepository } from '~/infrastructure/repository/users-repository';
import { Threads } from '~/use-cases/threads';

describe('Threads use-case test suite', () => {
  beforeEach(async () => {
    await db.delete(replies);
    await db.delete(comments);
    await db.delete(threads);
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(replies);
    await db.delete(comments);
    await db.delete(threads);
    await db.delete(users);
  });

  const userModel = new UsersDomain(new UsersRepository(db));
  const repliesModel = new RepliesDomain(new RepliesRepository(db));
  const commentsModel = new CommentsDomain(new CommentsRepository(db));
  const model = new ThreadsDomain(new ThreadsRepository(db));
  const payload = {
    title: 'this is title',
    body: 'lorem ipsum dolor sit amet.',
  };

  test('Create thread test case', async () => {
    const user = await createUser(userModel);
    const newThread = await Threads.createThread(user.username, payload, {
      threads: model,
      users: userModel,
    });

    expect(newThread).toHaveProperty('title', payload.title);
    expect(newThread).toHaveProperty('id');
    expect(typeof newThread.id).toBe('string');
  });

  test('Create thread test case with bad payload', async () => {
    const user = await createUser(userModel);
    const payload = { title: 'test', body: '' };

    expect(async () => {
      await Threads.createThread(user.username, payload, {
        threads: model,
        users: userModel,
      });
    }).rejects.toThrow(ClientError);
  });

  test('Get thread with comments and replies test case', async () => {
    const threadTitle = 'this is title';
    const threadBody = 'this is body';
    const userA = await createUser(userModel);
    const userB = await createUser(userModel);
    const thread = await model.create(threadTitle, threadBody, userA.id);
    const commentContent = 'this is a comment';
    const replyContent = 'this is a reply';
    const returnedComment = await commentsModel.create(
      userB.id,
      thread.id,
      commentContent,
    );
    const returnedReplies = await repliesModel.create(
      userA.id,
      returnedComment.id,
      replyContent,
    );

    const threadWithComments = await Threads.getThreadDetail(thread.id, model);

    expect(threadWithComments).toHaveProperty('id', thread.id);
    expect(threadWithComments).toHaveProperty('title', thread.title);
    expect(threadWithComments).toHaveProperty('body', threadBody);
    expect(threadWithComments).toHaveProperty('username', userA.username);

    expect(threadWithComments).toHaveProperty('date');
    expect(threadWithComments?.date).toBeInstanceOf(Date);

    expect(threadWithComments).toHaveProperty('comments');
    expect(Array.isArray(threadWithComments?.comments)).toBeTruthy();
    expect(threadWithComments?.comments.length).toEqual(1);

    const comment = threadWithComments?.comments[0];

    expect(comment).toHaveProperty('id', returnedComment.id);
    expect(comment).toHaveProperty('username', userB.username);
    expect(comment).toHaveProperty('date', comment?.date);
    expect(comment).toHaveProperty('content', commentContent);
    expect(comment).toHaveProperty('replies');
    expect(Array.isArray(comment?.replies)).toBeTruthy();
    expect(comment?.replies.length).toEqual(1);

    const reply = comment?.replies[0];

    expect(reply).toHaveProperty('id', returnedReplies.id);
    expect(reply).toHaveProperty('username', userA.username);
    expect(reply).toHaveProperty('content', replyContent);

    expect(reply).toHaveProperty('date');
    expect(reply?.date).toBeInstanceOf(Date);
  });
});

async function createUser(domain: UsersDomain) {
  return await domain.create({
    fullname: 'jhondoe',
    password: 'supersecret',
    username: randomStr(7),
  });
}
