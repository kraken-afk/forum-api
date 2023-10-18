import { ICrypto } from '~/infrastructure/contracts/T-crypto';

export class Crypto {
  constructor(private readonly repository: ICrypto) {}

  async hash(str: string): Promise<string> {
    return await this.repository.hash(str);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await this.repository.compare(password, hash);
  }
}
