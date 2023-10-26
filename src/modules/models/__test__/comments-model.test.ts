import { db } from '@test/helpers/db';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { Comments } from '~/domains/models/comments';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { CommentsRepository } from '~/infrastructure/repository/comments-repository';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

const model = new Comments(new CommentsRepository(db));
const usersModel = new Users(new UsersRepository(db));
const threadModel = new Threads(new ThreadsRepository(db));

describe('Comments model test suits', () => {
  const COMMENT = 'Lorem ipsum dolor sit amet';

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

  test('Create comment test case', async () => {
    const user = await createUser();
    const thread = await createThread(user);

    const comment = await model.create(user.id, thread.id, COMMENT);

    expect(comment).toHaveProperty('id');
    expect(comment.id).toBeTypeOf('string');

    expect(comment).toHaveProperty('owner');
    expect(comment.owner).toBe(user.username);

    expect(comment).toHaveProperty('content');
    expect(comment.content).toBe(COMMENT);

    expect(comment).toHaveProperty('date');
    expect(comment.date).toBeInstanceOf(Date);
  });

  test('Select comment test case', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    const selectedComment = await model.select(comment.id);

    expect(selectedComment).toHaveProperty('id');
    expect(selectedComment?.id).toBeTypeOf('string');

    expect(selectedComment).toHaveProperty('owner');
    expect(selectedComment?.owner).toBe(user.username);

    expect(selectedComment).toHaveProperty('content');
    expect(selectedComment?.content).toBe(COMMENT);

    expect(selectedComment).toHaveProperty('date');
    expect(selectedComment?.date).toBeInstanceOf(Date);
  });

  test('Update comment test case', async () => {
    const newComment = 'new comment';
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    const updatedComment = await model.update(comment.id, newComment);

    expect(updatedComment).toHaveProperty('id');
    expect(updatedComment.id).toBeTypeOf('string');

    expect(updatedComment).toHaveProperty('owner');
    expect(updatedComment.owner).toBe(user.username);

    expect(updatedComment).toHaveProperty('content');
    expect(updatedComment.content).toBe(newComment);

    expect(updatedComment).toHaveProperty('date');
    expect(updatedComment.date).toBeInstanceOf(Date);
  });

  test('Delete Comment', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    await model.delete(comment.id);

    expect(await model.select(comment.id)).toBeFalsy();
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
