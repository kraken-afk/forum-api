import { ClientError } from '~/commons/errors/client-error';
import { loginPayloadValidator } from '~/modules/validators/login-payload-validator';

test('Login payload validator test case', () => {
  // User should send username & password
  const successPayload = { username: 'xxxx', password: 'xxxx' };
  const failPayload = { username: [], password: 'xxxx' };

  expect(loginPayloadValidator(successPayload)).toHaveProperty('success', true);

  expect(() => loginPayloadValidator(failPayload)).toThrowError(ClientError);
});
