import { ICrypto } from '~/infrastructure/contracts/T-crypto';

export class CryptoMock implements ICrypto {
  async hash(str: string): Promise<string> {
    return mockHash(str);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password === mockHash(hash);
  }
}

function mockHash(str: string): string {
  return str.split('').reverse().join('');
}
