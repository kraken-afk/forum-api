type UserPayload = {
  username: string;
  fullname: string;
  password: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

type RefreshTokenPayload = {
  refreshToken: string;
};
