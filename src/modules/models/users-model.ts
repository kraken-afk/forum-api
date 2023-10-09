import { eq } from 'drizzle-orm';
import { db as drizzle } from '~/database/db';
import { users as usersSchema } from '~/database/schema';
import { crypto } from '~/modules/security/crypto';

type UserPayload = {
  username: string;
  fullname: string;
  password: string;
};

export namespace users {
  export async function createUser(payload: UserPayload): Promise<{
    username: string;
    fullname: string;
    id: string;
  }> {
    const hash = await crypto.hash(payload.password);

    return (
      await drizzle
        .insert(usersSchema)
        .values({
          fullname: payload.fullname,
          username: payload.username,
          password: hash,
        })
        .returning({
          username: usersSchema.username,
          id: usersSchema.id,
          fullname: usersSchema.fullname,
        })
    )[0];
  }

  export async function isUsernameExist(username: string): Promise<boolean> {
    const usn = await drizzle
      .selectDistinct({ username: usersSchema.username })
      .from(usersSchema)
      .where(eq(usersSchema.username, username));

    return usn.length > 0;
  }

  export async function isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    let status = false;
    const users = await drizzle
      .selectDistinct({ password: usersSchema.password })
      .from(usersSchema)
      .where(eq(usersSchema.username, username));

    for (const user of users) {
      status = await crypto.compare(password, user.password);
    }

    return status;
  }
}
