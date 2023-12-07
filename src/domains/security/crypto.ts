import { ICrypto } from '~/infrastructure/contracts/T-crypto';

export class Crypto {
  constructor(private readonly repository: ICrypto) {}

  hash(str: string): Promise<string> {
    return this.repository.hash(str) as Promise<string>;
  }

  compare(password: string, hash: string): Promise<boolean> {
    return this.repository.compare(password, hash) as Promise<boolean>;
  }
}
