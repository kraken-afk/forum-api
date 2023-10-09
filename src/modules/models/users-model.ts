import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db as drizzle } from '~/database/db';
import { users as usersSchema } from '~/database/schema';

export namespace db {
  export namespace users {
    type UserPayload = {
      username: string;
      fullname: string;
      password: string;
    };
    export async function createUser(payload: UserPayload) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(payload.password, salt);

      return await drizzle
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
        });
    }

    export async function isUsernameExist(username: string): Promise<boolean> {
      const usn = await drizzle
        .selectDistinct({ username: usersSchema.username })
        .from(usersSchema)
        .where(eq(usersSchema.username, username));

      return usn.length > 0;
    }
  }
}
