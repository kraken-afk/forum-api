import { CryptoMock } from '~/domains/security/__test__/mock/crypto-repository-mock';
import { Crypto } from '~/domains/security/crypto';

const crypto = new Crypto(new CryptoMock());

describe('Crypto repository test suite', () => {
  test('Hashing string', async () => {
    const password = 'supersecret';
    const hashed = await crypto.hash(password);

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toEqual(password);
  });

  test('Comparing hashed password', async () => {
    const password = 'supersecret';
    const hashed = await crypto.hash(password);

    expect(await crypto.compare(password, hashed)).toBeTruthy();
    expect(await crypto.compare('wrongpassword', hashed)).toBeFalsy();
  });
});
