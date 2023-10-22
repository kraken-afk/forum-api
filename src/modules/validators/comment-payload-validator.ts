import { ClientError } from '~/commons/errors/client-error';
import { commentSchema } from '~/commons/libs/zod-types';

export function commentPayloadValidator(payload: unknown): Validator {
  const result = commentSchema.safeParse(payload);

  if (!result.success) {
    const messages: string[] = [];
    for (const err of result.error.errors) {
      messages.push(`${err.path.join(', ')}: ${err.message}`);
    }
    throw new ClientError(messages.join(', '));
  } else {
    return { success: true };
  }
}
