import { db } from '@test/helpers/db';
import { randomStr } from '~/commons/libs/random-str';
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

const model = new ThreadsRepository(db);
const repliesModel = new RepliesRepository(db);
const commentsModel = new CommentsRepository(db);
const userModel = new UsersRepository(db);

describe('Threads repository test suite', () => {
  const threadTitle = 'Lorem ipsum.';
  const threadBody =
    'tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui.';

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
    expect(selectedThread?.date).toBeInstanceOf(Date);
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

  test('Get thread with comments test case', async () => {
    const userA = await insertUser();
    const userB = await insertUser();
    const thread = await model.create(threadTitle, threadBody, userA.id);
    const commentContent = 'this is a comment';
    const returnedComment = await commentsModel.create(
      userB.id,
      thread.id,
      commentContent,
    );
    const threadWithComments = await model.getThreadsWithComments(thread.id);

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
    expect(comment?.replies.length).toEqual(0);
  });

  test('Get thread with comments and replies test case', async () => {
    const userA = await insertUser();
    const userB = await insertUser();
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

    const threadWithComments = await model.getThreadsWithComments(thread.id);

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

async function insertUser() {
  return await userModel.create({
    fullname: 'Jhon doe',
    username: randomStr(7),
    password: 'supersecret',
  });
}
