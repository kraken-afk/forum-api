import { db } from '@test/helpers/db';
import { randomStr } from '~/commons/libs/random-str';
import { ThreadsMock } from '~/domains/models/__test__/mock/threads-repository-mock';
import { UsersMock } from '~/domains/models/__test__/mock/users-repository-mock';
import { Threads } from '~/domains/models/threads';
import { Users } from '~/domains/models/users';

const threadMock = new ThreadsMock(db);
const userMock = new UsersMock(db);

const model = new Threads(threadMock);
const userModel = new Users(userMock);

describe('Threads repository test suite', () => {
  const threadTitle = 'Lorem ipsum.';
  const threadBody =
    'tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui.';

  test('Method checks', () => {
    expect(model).toHaveProperty('create');
    expect(model).toHaveProperty('select');
    expect(model).toHaveProperty('update');
    expect(model).toHaveProperty('delete');
  });

  test('Create thread test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);

    expect(typeof thread.id).toBe('string');
    expect(typeof thread.title).toBe('string');
    expect(typeof thread.owner).toBe('string');

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
  });

  test('Update thread test case', async () => {
    const user = await insertUser();
    const thread = await model.create(threadTitle, threadBody, user.id);
    const newTitle = 'new title';

    const updatedThread = await model.update(thread.id, { title: newTitle });

    expect(typeof updatedThread.title).toBe('string');
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
