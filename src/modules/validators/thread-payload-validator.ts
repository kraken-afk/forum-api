import { ClientError } from '~/commons/errors/client-error';
import { threadSchema } from '~/commons/libs/zod-types';

/**
 * @throws ClientError
 */
export function threadPayloadValidator(payload: unknown): Validator {
  const result = threadSchema.safeParse(payload);

  if (!result.success) {
    const messages: string[] = [];
    for (const err of result.error.errors) {
      // Seharus nya format error seperti ini, tapi ada test case yang strict terhadap isi message
      // messages.push(`${err.path.join(', ')}: ${err.message}`);
      messages.push(`${err.path.join(', ')}: ${err.message}`);
    }
    throw new ClientError(messages.join(', '));
  } else {
    return { success: true };
  }
}
