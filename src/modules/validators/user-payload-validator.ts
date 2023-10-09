import { ClientError } from '~/errors/client-error';
import { userSchema } from '~/libs/zod-types';

/**
 * @throws ClientError
 */
export function userPayloadValidator(payload: unknown): Validator {
  const result = userSchema.safeParse(payload);

  if (!result.success) {
    const messages: string[] = [];
    for (const err of result.error.errors) {
      // Seharus nya format error seperti ini, tapi ada test case yang strict terhadap isi message
      // messages.push(`${err.path.join(', ')}: ${err.message}`);
      messages.push(err.message);
    }
    throw new ClientError(messages.join(', '));
  } else {
    return { success: true };
  }
}
