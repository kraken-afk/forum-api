import { expect, test } from 'vitest';
import { ClientError } from '~/commons/errors/client-error';
import { commentPayloadValidator } from '~/modules/validators/comment-payload-validator';

test('Comment payload validator test case', () => {
  // User should send content
  const successPayload = { content: 'Lorem ipsum dolor sit amet.' };
  const failPayload = { content: [] };

  expect(commentPayloadValidator(successPayload)).toHaveProperty(
    'success',
    true,
  );

  expect(() => commentPayloadValidator(failPayload)).toThrowError(ClientError);
});
