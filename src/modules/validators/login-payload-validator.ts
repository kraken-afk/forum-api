import { ClientError } from '~/commons/errors/client-error';
import { loginSchema } from '~/commons/libs/zod-types';

export function loginPayloadValidator(payload: unknown): Validator {
  const result = loginSchema.safeParse(payload);

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
