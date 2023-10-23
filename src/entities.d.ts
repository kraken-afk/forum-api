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

type CommentPayload = {
  content: string;
};

type ReplyPayload = {
  content: string;
};

type Auth = {
  accessToken: string;
  refreshToken: string;
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

type TComment = {
  id: string;
  username: string;
  date: Date;
  content: string;
};

type Reply = {
  id: string;
  owner: string;
  content: string;
};

type ThreadsDetail = {
  id: string;
  title: string;
  body: string;
  username: string;
  date: Date;
  comments: Array<{
    id: string;
    username: string;
    date: Date;
    content: string;
    replies: Array<{
      id: string;
      content: string;
      date: Date;
      username: string;
    }>;
  }>;
};
