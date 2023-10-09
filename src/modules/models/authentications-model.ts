import { eq } from 'drizzle-orm';
import { db as drizzle } from '~/database/db';
import { authentications as authenticationsSchema } from '~/database/schema';

export namespace authentications {
  export async function insert(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await drizzle
      .insert(authenticationsSchema)
      .values({ token: accessToken, refreshToken: refreshToken });
  }

  export async function updateToken(
    newToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const result = (
      await drizzle
        .update(authenticationsSchema)
        .set({ token: newToken })
        .where(eq(authenticationsSchema.refreshToken, refreshToken))
        .returning({ accessToken: authenticationsSchema.token })
    )[0];

    return result;
  }

  export async function deleteToken(refreshToken: string) {
    await drizzle
      .delete(authenticationsSchema)
      .where(eq(authenticationsSchema.refreshToken, refreshToken));
  }

  export async function isExist(refreshToken: string): Promise<boolean> {
    const result = await drizzle
      .selectDistinct({ refreshToken: authenticationsSchema.refreshToken })
      .from(authenticationsSchema)
      .where(eq(authenticationsSchema.refreshToken, refreshToken));

    return result.length > 0;
  }
}
