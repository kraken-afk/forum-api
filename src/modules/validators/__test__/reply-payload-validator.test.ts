import { expect, test } from 'vitest';
import { ClientError } from '~/commons/errors/client-error';
import { replyPayloadValidator } from '~/modules/validators/reply-payload-validator';

test('Reply payload validator test case', () => {
  // User should send content
  const successPayload = { content: 'Lorem ipsum dolor sit amet.' };
  const failPayload = { content: [] };

  expect(replyPayloadValidator(successPayload)).toHaveProperty('success', true);

  expect(() => replyPayloadValidator(failPayload)).toThrowError(ClientError);
});
