import { eq } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IUsers } from '~/infrastructure/contracts/T-users';
import { users as usersSchema } from '~/infrastructure/database/schema';
import { crypto } from '~/modules/security/crypto';

export class UsersRepository implements IUsers {
  constructor(public readonly db: PostgresJsDatabase) {}

  async createUser(payload: UserPayload): Promise<{
    username: string;
    fullname: string;
    id: string;
  }> {
    const hash = await crypto.hash(payload.password);

    return (
      await this.db
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

  async isUsernameExist(username: string): Promise<boolean> {
    const usn = await this.db
      .selectDistinct({ username: usersSchema.username })
      .from(usersSchema)
      .where(eq(usersSchema.username, username));

    return usn.length > 0;
  }

  async isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    let status = false;
    const users = await this.db
      .selectDistinct({ password: usersSchema.password })
      .from(usersSchema)
      .where(eq(usersSchema.username, username));

    for (const user of users) {
      status = await crypto.compare(password, user.password);
    }

    return status;
  }
}