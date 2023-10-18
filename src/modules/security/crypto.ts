import { Crypto } from '~/domains/security/crypto';
import { CryptoRepository } from '~/infrastructure/repository/crypto-repository';

export const crypto = new Crypto(new CryptoRepository());
