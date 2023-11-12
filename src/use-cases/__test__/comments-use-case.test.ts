import { db } from '@test/helpers/db';
import { ClientError } from '~/commons/errors/client-error';
import { randomStr } from '~/commons/libs/random-str';
import { Comments as CommentsDomain } from '~/domains/models/comments';
import { Threads as ThreadsDomain } from '~/domains/models/threads';
import { Users as UsersDomain } from '~/domains/models/users';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { CommentsRepository } from '~/infrastructure/repository/comments-repository';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';
import { UsersRepository } from '~/infrastructure/repository/users-repository';
import { Comments } from '~/use-cases/comments';

describe('Comments use-case test suite', () => {
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
  const model = new CommentsDomain(new CommentsRepository(db));

  test('Create comment test case', async () => {
    const content = 'this is a comment';
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );

    const comment = await Comments.createComment(
      user.username,
      thread.id,
      { content },
      { comments: model, threads: threadModel, users: userModel },
    );

    expect(comment).toHaveProperty('owner', user.username);
    expect(comment).toHaveProperty('content', content);
    expect(comment).toHaveProperty('date');
    expect(comment.date).toBeInstanceOf(Date);
    expect(comment).toHaveProperty('id');
    expect(typeof comment.id).toBe('string');
  });

  test('Create comment with bad payload test case', async () => {
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );

    expect(async () => {
      await Comments.createComment(
        user.username,
        thread.id,
        { content: '' },
        { comments: model, threads: threadModel, users: userModel },
      );
    }).rejects.toThrow(ClientError);
  });

  test('Delete comment test case', async () => {
    const content = 'this is a comment';
    const user = await createUser(userModel);
    const payload = createThreadPayload();
    const thread = await createThread(
      { body: payload.body, title: payload.title, ownerId: user.id },
      threadModel,
    );

    const comment = await Comments.createComment(
      user.username,
      thread.id,
      { content },
      { comments: model, threads: threadModel, users: userModel },
    );

    await Comments.deleteComment(comment.id, comment.owner, {
      comments: model,
      users: userModel,
    });

    expect(await model.select(comment.id)).toBeFalsy();
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
