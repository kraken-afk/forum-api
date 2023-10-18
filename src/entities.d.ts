type UserPayload = {
  username: string;
  fullname: string;
  password: string;
};

type JwtPayload = {
  username: string;
  exp?: number;
};

type LoginPayload = {
  username: string;
  password: string;
};

type RefreshTokenPayload = {
  refreshToken: string;
};

type ThreadPyaload = {
  title: string;
  body: string;
};
