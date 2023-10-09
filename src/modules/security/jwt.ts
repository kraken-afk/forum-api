import jwtoken from 'jsonwebtoken';

type JwtPayload = {
  username: string;
  exp?: number;
};

export namespace jwt {
  const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

  export function createAccessToken(payload: JwtPayload) {
    const token = jwtoken.sign(payload, ACCESS_TOKEN_KEY!);
    return token;
  }

  export function createRefreshToken(payload: JwtPayload) {
    const token = jwtoken.sign(payload, REFRESH_TOKEN_KEY!, {
      expiresIn: '30d',
    });
    return token;
  }

  export function verifyToken(token: string, secret: string) {
    try {
      jwtoken.verify(token, secret);
      return true;
    } catch {
      return false;
    }
  }

  export function unpack(token: string) {
    return jwtoken.decode(token);
  }
}
