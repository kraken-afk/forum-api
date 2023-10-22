import { db } from '@test/helpers/db';
import { afterAll, beforeEach, describe, expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';
import { threads, users } from '~/infrastructure/database/schema';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

const model = new Threads(new ThreadsRepository(db));
const userModel = new Users(new UsersRepository(db));

describe('Threads model test suite', () => {
  const threadTitle = 'Lorem ipsum.';
  const threadBody =
    'tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui.';

  beforeEach(async () => {
    await db.delete(threads);
    await db.delete(users);
  });

  afterAll(async () => {
    await db.delete(threads);
    await db.delete(users);
  });

  test('Method checks', () => {
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Create thread test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);

    expect(thread.id).toBeTypeOf('string');
    expect(thread.title).toBeTypeOf('string');
    expect(thread.owner).toBeTypeOf('string');

    expect(thread.title).toBe(threadTitle);
    expect(thread.owner).toBe(user.id);
  });

  test('Select thread by id test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);

    const selectedThread = await model.select(thread.id);

    expect(selectedThread).toHaveProperty('id', thread.id);
    expect(selectedThread).toHaveProperty('title', threadTitle);
    expect(selectedThread).toHaveProperty('body', threadBody);
    expect(selectedThread).toHaveProperty('owner', user.id);
    expect(selectedThread?.date).toBeInstanceOf(Date);
  });

  test('Update thread test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);
    const newTitle = 'new title';

    const updatedThread = await model.update(thread.id, { title: newTitle });

    expect(updatedThread.title).toBeTypeOf('string');
    expect(updatedThread.title).toBe(newTitle);
    expect(updatedThread.body).toBe(threadBody);
    expect(updatedThread.owner).toBe(thread.owner);
  });

  test('Delete thread test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);

    await model.delete(thread.id);

    expect(await model.select(thread.id)).toBeFalsy();
  });
});

async function insertUser() {
  return await userModel.create({
    fullname: 'Jhon doe',
    username: randomStr(7),
    password: 'supersecret',
  });
}
