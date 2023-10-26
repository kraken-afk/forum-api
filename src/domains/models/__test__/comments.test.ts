import { db } from '@test/helpers/db';
import { describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { CommentsMock } from '~/domains/models/__test__/mock/comments-repository-mock';
import { ThreadsMock } from '~/domains/models/__test__/mock/threads-repository-mock';
import { UsersMock } from '~/domains/models/__test__/mock/users-repository-mock';
import { Comments } from '~/domains/models/comments';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';

const usersMock = new UsersMock(db);
const threadsMock = new ThreadsMock(db);
const commensMock = new CommentsMock(db);

const model = new Comments(commensMock);
const usersModel = new Users(usersMock);
const threadModel = new Threads(threadsMock);

describe('Comments model test suits', () => {
  const COMMENT = 'Lorem ipsum dolor sit amet';

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

    expect(await model.select(comment.id, { all: false })).toBeFalsy();
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
