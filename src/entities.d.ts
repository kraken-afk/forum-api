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

type ThreadPayload = {
  title: string;
  body: string;
};

type User = {
  username: string;
  fullname: string;
  id: string;
};

type Thread = {
  id: string;
  title: string;
  body: string;
  owner: string;
  date: Date;
};
