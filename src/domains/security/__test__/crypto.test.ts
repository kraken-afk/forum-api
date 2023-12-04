import { Crypto } from '~/domains/security/crypto';
import { ICrypto } from '~/infrastructure/contracts/T-crypto';

describe('Crypto repository test suite', () => {
  test('Hashing string', async () => {
    const MockedCryptoRepository = <jest.Mock<ICrypto>>jest.fn(() => ({
      async hash(str) {
        return str.split('').reverse().join('');
      },
    }));
    const crypto = new Crypto(new MockedCryptoRepository());
    const password = 'supersecret';
    const hashed = await crypto.hash(password);

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toEqual(password);
  });

  test('Comparing hashed password', async () => {
    const MockedCryptoRepository = <jest.Mock<ICrypto>>jest.fn(() => ({
      async compare(password, hash) {
        return password.split('').reverse().join('') === hash;
      },
      async hash(str) {
        return str.split('').reverse().join('');
      },
    }));
    const crypto = new Crypto(new MockedCryptoRepository());
    const password = 'supersecret';
    const hashed = await crypto.hash(password);

    expect(await crypto.compare(password, hashed)).toBeTruthy();
    expect(await crypto.compare('wrongpassword', hashed)).toBeFalsy();
  });
});
