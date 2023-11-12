import { db } from '@test/helpers/db';
import { ClientError } from '~/commons/errors/client-error';
import { randomStr } from '~/commons/libs/random-str';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Replies as RepliesModel } from '~/domains/models/replies';
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
import { Replies } from '~/use-cases/replies';

describe('Replies use-case test suite', () => {
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
  const threadModel = new ThreadsDomain(new ThreadsRepository(db));
  const commentModel = new CommentsDomain(new CommentsRepository(db));
  const model = new RepliesModel(new RepliesRepository(db));

  test('Create reply test case', async () => {
    const content = 'this is a reply';
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );
    const comment = await commentModel.create(
      user.id,
      thread.id,
      'this is a comment',
    );

    const reply = await Replies.createReply(
      user.username,
      { commentId: comment.id, threadId: thread.id },
      { content },
      {
        comments: commentModel,
        threads: threadModel,
        users: userModel,
        replies: model,
      },
    );

    expect(reply).toHaveProperty('content', content);
    expect(reply).toHaveProperty('owner', user.id);
    expect(reply).toHaveProperty('id');
    expect(typeof reply.id).toBe('string');
  });

  test('Create reply with bad payload test case', async () => {
    const content = '';
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );
    const comment = await commentModel.create(
      user.id,
      thread.id,
      'this is a comment',
    );

    expect(async () => {
      await Replies.createReply(
        user.username,
        { commentId: comment.id, threadId: thread.id },
        { content },
        {
          comments: commentModel,
          threads: threadModel,
          users: userModel,
          replies: model,
        },
      );
    }).rejects.toThrow(ClientError);
  });

  test('Delete reply test case', async () => {
    const content = 'this is a reply';
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );
    const comment = await commentModel.create(
      user.id,
      thread.id,
      'this is a comment',
    );

    const reply = await Replies.createReply(
      user.username,
      { commentId: comment.id, threadId: thread.id },
      { content },
      {
        comments: commentModel,
        threads: threadModel,
        users: userModel,
        replies: model,
      },
    );

    void (await Replies.deleteReply(
      reply.id,
      user.username,
      { commentId: comment.id, threadId: thread.id },
      {
        comments: commentModel,
        threads: threadModel,
        users: userModel,
        replies: model,
      },
    ));
  });
});

async function createThread(
  payload: ThreadPayload & { ownerId: string },
  domain: ThreadsDomain,
) {
  return await domain.create(payload.title, payload.body, payload.ownerId);
}

async function createUser(domain: UsersDomain) {
  return await domain.create({
    fullname: 'jhondoe',
    password: 'supersecret',
    username: randomStr(7),
  });
}

function createThreadPayload() {
  return { title: 'lorem', body: 'ipsum dolor sit' };
}
