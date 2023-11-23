import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { randomStr } from '~/commons/libs/random-str';

export const authentications = pgTable('authentications', {
  token: varchar('token').primaryKey().notNull(),
  refreshToken: varchar('refreshToken').notNull(),
});

export const users = pgTable('users', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => `user-${randomStr(7)}`)
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
    .$defaultFn(() => `thread-${randomStr(7)}`)
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
    .$defaultFn(() => `comment-${randomStr(7)}`)
    .notNull(),
  content: text('body').notNull(),
  masterId: varchar('masterId')
    .references(() => threads.id)
    .notNull(),
  ownerId: varchar('ownerId')
    .references(() => users.id)
    .notNull(),
  isDeleted: boolean('isDeleted')
    .$default(() => false)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const replies = pgTable('replies', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => `reply-${randomStr(7)}`)
    .notNull(),
  content: text('body').notNull(),
  masterId: varchar('masterId')
    .references(() => comments.id)
    .notNull(),
  ownerId: varchar('ownerId')
    .references(() => users.id)
    .notNull(),
  isDeleted: boolean('isDeleted')
    .$default(() => false)
    .notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const usersRelation = relations(users, ({ many }) => ({
  threads: many(threads),
}));

export const threadsRelation = relations(threads, ({ many }) => ({
  threads: many(comments),
}));

export const commentsToReplies = relations(comments, ({ many }) => ({
  comments: many(replies),
}));

export const commentsRelation = relations(comments, ({ one }) => ({
  thread: one(threads, {
    fields: [comments.masterId],
    references: [threads.id],
  }),
}));

export const repliesRelation = relations(replies, ({ one }) => ({
  comment: one(comments, {
    fields: [replies.masterId],
    references: [comments.id],
  }),
}));
