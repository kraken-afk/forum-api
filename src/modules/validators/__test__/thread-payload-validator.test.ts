import { ClientError } from '~/commons/errors/client-error';
import { threadPayloadValidator } from '~/modules/validators/thread-payload-validator';

test('Thread payload validator test case', () => {
  // User should send title & body
  const successPayload = { title: 'title', body: 'Lorem ipsum dolor.' };
  const failPayload = { title: [], body: 'Lorem ipsum dolor.' };

  expect(threadPayloadValidator(successPayload)).toHaveProperty(
    'success',
    true,
  );
  expect(() => threadPayloadValidator(failPayload)).toThrow(ClientError);
});
