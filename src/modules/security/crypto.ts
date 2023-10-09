import bcrypt from 'bcryptjs';

export namespace crypto {
  export async function hash(str: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(str, salt);
    return hash;
  }

  export async function compare(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
