import { ClientError } from '~/commons/errors/client-error';
import { userPayloadValidator } from '~/modules/validators/user-payload-validator';

test('Create new user payload test case', () => {
  // User should send username, fullname, & password
  const successPayload = {
    username: 'xxxx',
    password: 'xxxx',
    fullname: 'xxxxx',
  };
  const failPayload = { username: [], password: 'xxxx' };

  expect(userPayloadValidator(successPayload)).toHaveProperty('success', true);
  expect(() => userPayloadValidator(failPayload)).toThrowError(ClientError);
});
