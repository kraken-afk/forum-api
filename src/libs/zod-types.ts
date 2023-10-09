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
