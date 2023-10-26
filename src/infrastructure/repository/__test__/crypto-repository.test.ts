import { CryptoRepository } from '~/infrastructure/repository/crypto-repository';

const crypto = new CryptoRepository();

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
