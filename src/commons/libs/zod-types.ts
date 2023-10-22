import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(255)
    .regex(
      /^[A-z\d]+$/,
      'tidak dapat membuat user baru karena username mengandung karakter terlarang',
    ),
  fullname: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[A-z\d\s]+$/, 'only alphanumeric characters allowed for fullname'),
  password: z.string().min(1),
});

export const loginSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const threadSchema = z.object({
  title: z.string().min(1).max(36),
  body: z.string().min(1).max(510),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(255),
});

export const replySchema = z.object({
  content: z.string().min(1).max(255),
});
