export interface ICrypto {
  hash: (str: string) => Promise<string> | string;
  compare: (password: string, hash: string) => Promise<boolean> | boolean;
}
