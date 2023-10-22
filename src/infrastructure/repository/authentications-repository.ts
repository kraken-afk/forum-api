import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { IAuthentications } from '~/infrastructure/contracts/T-authentications';
import { authentications as authenticationsSchema } from '~/infrastructure/database/schema';

export class AuthenticationsRepository implements IAuthentications {
  constructor(public readonly db: PostgresJsDatabase) {}

  async insert(accessToken: string, refreshToken: string): Promise<Auth> {
    return (
      await this.db
        .insert(authenticationsSchema)
        .values({ token: accessToken, refreshToken: refreshToken })
        .returning({
          accessToken: authenticationsSchema.token,
          refreshToken: authenticationsSchema.refreshToken,
        })
    )[0];
  }

  async updateToken(
    newToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const result = (
      await this.db
        .update(authenticationsSchema)
        .set({ token: newToken })
        .where(eq(authenticationsSchema.refreshToken, refreshToken))
        .returning({ accessToken: authenticationsSchema.token })
    )[0];

    return result;
  }

  async deleteToken(refreshToken: string): Promise<void> {
    await this.db
      .delete(authenticationsSchema)
      .where(eq(authenticationsSchema.refreshToken, refreshToken));
  }

  async isRefreshTokenExist(refreshToken: string): Promise<boolean> {
    const result = await this.db
      .selectDistinct({ refreshToken: authenticationsSchema.refreshToken })
      .from(authenticationsSchema)
      .where(eq(authenticationsSchema.refreshToken, refreshToken));

    return result.length > 0;
  }

  async isAccessTokenExist(token: string): Promise<boolean> {
    const result = await this.db
      .selectDistinct({ token: authenticationsSchema.token })
      .from(authenticationsSchema)
      .where(eq(authenticationsSchema.token, token));

    return result.length > 0;
  }
}
