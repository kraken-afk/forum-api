import { db } from '@test/helpers/db';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { Comments } from '~/domains/models/comments';
import { Replies } from '~/domains/models/replies';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';
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

const model = new Replies(new RepliesRepository(db));
const commentsModel = new Comments(new CommentsRepository(db));
const usersModel = new Users(new UsersRepository(db));
const threadModel = new Threads(new ThreadsRepository(db));

describe('Replies repository test suits', () => {
  const COMMENT = 'comment';
  const REPLY = 'reply';

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

  test('Method check', () => {
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Create reply test case', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await commentsModel.create(user.id, thread.id, COMMENT);

    const reply = await model.create(user.id, comment.id, REPLY);

    expect(reply).toHaveProperty('id');
    expect(reply.id).toBeTypeOf('string');

    expect(reply).toHaveProperty('owner');
    expect(reply.owner).toBe(user.id);

    expect(reply).toHaveProperty('content');
    expect(reply.content).toBe(REPLY);
  });

  test('Select reply test case', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await commentsModel.create(user.id, thread.id, COMMENT);
    const reply = await model.create(user.id, comment.id, REPLY);

    const selectedReply = await model.select(reply.id);

    expect(selectedReply).toHaveProperty('id');
    expect(selectedReply?.id).toBeTypeOf('string');

    expect(selectedReply).toHaveProperty('owner');
    expect(selectedReply?.owner).toBe(user.id);

    expect(selectedReply).toHaveProperty('content');
    expect(selectedReply?.content).toBe(REPLY);
  });

  test('Update reply test case', async () => {
    const newReply = 'new reply';
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await commentsModel.create(user.id, thread.id, COMMENT);
    const reply = await model.create(user.id, comment.id, REPLY);

    const updatedReply = await model.update(reply.id, newReply);

    expect(updatedReply).toHaveProperty('id');
    expect(updatedReply.id).toBeTypeOf('string');

    expect(updatedReply).toHaveProperty('owner');
    expect(updatedReply?.owner).toBe(user.id);

    expect(updatedReply).toHaveProperty('content');
    expect(updatedReply.content).toBe(newReply);
  });

  test('Delete reply', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await commentsModel.create(user.id, thread.id, COMMENT);
    const reply = await model.create(user.id, comment.id, REPLY);

    await model.delete(reply.id);

    expect(await model.select(reply.id)).toBeFalsy();
  });
});

async function createUser() {
  return await usersModel.create({
    fullname: 'Jhon doe',
    username: randomStr(5),
    password: 'password',
  });
}

async function createThread(user: User) {
  return await threadModel.create(
    'title',
    'lorem ipsum dolor sit amet.',
    user.id,
  );
}
