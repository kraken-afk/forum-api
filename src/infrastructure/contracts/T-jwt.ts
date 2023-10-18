export interface IJwt {
  readonly ACCESS_TOKEN_KEY: string;
  readonly REFRESH_TOKEN_KEY: string;
  createAccessToken: (payload: JwtPayload) => string;
  createRefreshToken: (payload: JwtPayload) => string;
  verifyToken: (token: string, secret: string) => boolean;
  unpack: (token: string) => Record<string, unknown> | string | null;
}
