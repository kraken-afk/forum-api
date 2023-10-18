import jwtoken from 'jsonwebtoken';
import { IJwt } from '~/infrastructure/contracts/T-jwt';

export class JwtRepository implements IJwt {
  readonly REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY!;
  readonly ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY!;

  createAccessToken(payload: JwtPayload) {
    const options = 'exp' in payload ? {} : { expiresIn: '1h' };
    const token = jwtoken.sign(payload, this.ACCESS_TOKEN_KEY, options);
    return token;
  }

  createRefreshToken(payload: JwtPayload) {
    const options = 'exp' in payload ? {} : { expiresIn: '30d' };
    const token = jwtoken.sign(payload, this.REFRESH_TOKEN_KEY, options);
    return token;
  }

  verifyToken(token: string, secret: string) {
    try {
      jwtoken.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

  unpack(token: string) {
    return jwtoken.decode(token);
  }
}
