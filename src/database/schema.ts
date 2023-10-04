import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { randomStr } from '~/libs/random-str';

export const authentications = pgTable('authentications', {
  token: varchar('token').primaryKey(),
  refreshToken: varchar('refreshToken'),
});

export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr()),
  username: varchar('username').unique(),
  fullname: varchar('fullname'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('createdAt').defaultNow(),
});

export const threads = pgTable('threads', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr()),
  title: varchar('title'),
  body: text('body'),
  ownerId: varchar('ownerId').references(() => users.id),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('createdAt').defaultNow(),
});

export const comments = pgTable('comments', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr()),
  content: text('body'),
  threadsId: varchar('threadsId').references(() => threads.id),
  ownerId: varchar('ownerId').references(() => users.id),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('createdAt').defaultNow(),
});
