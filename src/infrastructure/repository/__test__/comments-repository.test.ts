import { db } from '@test/helpers/db';
import { randomStr } from '~/commons/libs/random-str';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { CommentsRepository } from '~/infrastructure/repository/comments-repository';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

const model = new CommentsRepository(db);
const usersModel = new UsersRepository(db);
const threadModel = new ThreadsRepository(db);

describe('Comments repository test suits', () => {
  const COMMENT = 'Lorem ipsum dolor sit amet';

  beforeEach(async () => {
    await db.delete(replies);
    await db.delete(comments);
    await db.delete(threads);
    await db.delete(users);
  });

  afterAll(done => {
    db.delete(replies)
      .then(() => db.delete(comments))
      .then(() => db.delete(threads))
      .then(() => db.delete(users))
      .then(() => done());
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
    expect(typeof comment.id).toBe('string');

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
    expect(typeof selectedComment?.id).toBe('string');

    expect(selectedComment).toHaveProperty('owner');
    expect(selectedComment?.owner).toBe(user.username);

    expect(selectedComment).toHaveProperty('content');
    expect(selectedComment?.content).toBe(COMMENT);

    expect(selectedComment).toHaveProperty('date');
    expect(selectedComment?.date).toBeInstanceOf(Date);

    expect(selectedComment).toHaveProperty('isDeleted');
    expect(selectedComment?.isDeleted).toBe(false);
  });

  test('Select comment test case including deleted comments', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    // delete comment
    await model.delete(comment.id);

    const selectedComment = await model.select(comment.id, { all: true });

    expect(selectedComment).toHaveProperty('id');
    expect(typeof selectedComment?.id).toBe('string');

    expect(selectedComment).toHaveProperty('owner');
    expect(selectedComment?.owner).toBe(user.username);

    expect(selectedComment).toHaveProperty('content');
    expect(selectedComment?.content).toBe(COMMENT);

    expect(selectedComment).toHaveProperty('date');
    expect(selectedComment?.date).toBeInstanceOf(Date);

    expect(selectedComment).toHaveProperty('isDeleted');
    expect(selectedComment?.isDeleted).toBe(true);
  });

  test("Select comment that didn't exist", async () => {
    const user = await createUser();
    const thread = await createThread(user);

    await model.create(user.id, thread.id, COMMENT);

    const selectedComment = await model.select('xxx');

    expect(selectedComment).toBe(undefined);
  });

  test('Update comment test case', async () => {
    const newComment = 'new comment';
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    const updatedComment = await model.update(comment.id, newComment);

    expect(updatedComment).toHaveProperty('id');
    expect(typeof updatedComment.id).toBe('string');

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

  test('Like Comment', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    expect(comment).toHaveProperty('likes');
    expect(Array.isArray(comment.likes)).toBeTruthy();
    expect(comment.likes.length).toEqual(0);

    const commentAfterLike = await model.like(user.id, comment.id);

    expect(commentAfterLike).toHaveProperty('likes');
    expect(Array.isArray(commentAfterLike.likes)).toBeTruthy();

    expect(commentAfterLike.likes.length).toEqual(1);
    expect(commentAfterLike.likes[0]).toBe(user.id);
  });

  test('Unlike Comment', async () => {
    const user = await createUser();
    const thread = await createThread(user);
    const comment = await model.create(user.id, thread.id, COMMENT);

    expect(comment).toHaveProperty('likes');
    expect(Array.isArray(comment.likes)).toBeTruthy;
    expect(comment.likes.length).toEqual(0);

    const commentAfterLike = await model.like(user.id, comment.id);

    expect(commentAfterLike).toHaveProperty('likes');
    expect(Array.isArray(commentAfterLike.likes)).toBeTruthy();

    expect(commentAfterLike.likes.length).toEqual(1);
    expect(commentAfterLike.likes[0]).toBe(user.id);

    const commentAfterUnlike = await model.like(user.id, comment.id);

    expect(commentAfterUnlike).toHaveProperty('likes');
    expect(Array.isArray(commentAfterUnlike.likes)).toBeTruthy();

    expect(commentAfterUnlike.likes.length).toEqual(0);
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
