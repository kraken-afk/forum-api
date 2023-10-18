import { IJwt } from '~/infrastructure/contracts/T-jwt';

export class Jwt {
  constructor(private readonly repository: IJwt) {}

  createAccessToken(payload: JwtPayload) {
    return this.repository.createAccessToken(payload);
  }

  createRefreshToken(payload: JwtPayload) {
    return this.repository.createRefreshToken(payload);
  }

  verifyToken(token: string, secret: string) {
    return this.repository.verifyToken(token, secret);
  }

  unpack(token: string) {
    return this.repository.unpack(token);
  }
}
