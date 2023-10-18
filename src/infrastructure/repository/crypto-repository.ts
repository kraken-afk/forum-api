import bcrypt from 'bcryptjs';
import { ICrypto } from '~/infrastructure/contracts/T-crypto';

export class CryptoRepository implements ICrypto {
  async hash(str: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(str, salt);
    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
