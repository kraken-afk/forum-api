import { eq } from 'drizzle-orm';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IUsers } from '~/infrastructure/contracts/T-users';
import {
  comments,
  replies,
  threads,
  users,
} from '~/infrastructure/database/schema';
import { crypto } from '~/modules/security/crypto';

export class UsersRepository implements IUsers {
  constructor(public readonly db: PostgresJsDatabase) {}

  async create(payload: UserPayload): Promise<User> {
    const hash = await crypto.hash(payload.password);

    return (
      await this.db
        .insert(users)
        .values({
          fullname: payload.fullname,
          username: payload.username,
          password: hash,
        })
        .returning({
          username: users.username,
          id: users.id,
          fullname: users.fullname,
        })
    )[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(replies).where(eq(replies.ownerId, id));
    await this.db.delete(comments).where(eq(comments.ownerId, id));
    await this.db.delete(threads).where(eq(threads.ownerId, id));
    await this.db.delete(users).where(eq(users.id, id));
  }

  async select(username: string): Promise<User | undefined> {
    return (
      await this.db
        .selectDistinct({
          username: users.username,
          fullname: users.fullname,
          id: users.id,
        })
        .from(users)
        .where(eq(users.username, username))
    )[0];
  }

  async isUsernameExist(username: string): Promise<boolean> {
    const usn = await this.db
      .selectDistinct({ username: users.username })
      .from(users)
      .where(eq(users.username, username));

    return usn.length > 0;
  }

  async isPasswordAndUsernameMatch(
    username: string,
    password: string,
  ): Promise<boolean> {
    let status = false;
    const userList = await this.db
      .selectDistinct({ password: users.password })
      .from(users)
      .where(eq(users.username, username));

    for (const user of userList) {
      status = await crypto.compare(password, user.password);
    }

    return status;
  }
}
