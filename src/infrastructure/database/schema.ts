import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { randomStr } from '~/commons/libs/random-str';

export const authentications = pgTable('authentications', {
  token: varchar('token').primaryKey().notNull(),
  refreshToken: varchar('refreshToken').notNull(),
});

export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr())
    .notNull(),
  username: varchar('username').unique().notNull(),
  fullname: varchar('fullname').notNull(),
  password: varchar('password').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const threads = pgTable('threads', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr())
    .notNull(),
  title: varchar('title').notNull(),
  body: text('body').notNull(),
  ownerId: varchar('ownerId')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => randomStr())
    .notNull(),
  content: text('body').notNull(),
  threadsId: varchar('threadsId')
    .references(() => threads.id)
    .notNull(),
  ownerId: varchar('ownerId')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});
