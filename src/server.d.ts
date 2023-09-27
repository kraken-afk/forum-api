/// <reference path="./node_modules/@types/node/http.d.ts" />

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type HttpMethodKey = 'get' | 'post' | 'delete' | 'put' | 'patch';
type ServerState = 'SUCCESS' | 'ERROR' | 'NOT FOUND';
type RouterFunc = (request: Request, response: Response) => Response;
type AppRouter = Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>;

declare const __OUT_DIR__: string;

type UrlMatchStatus = 'TRUE' | 'PARAMS' | 'FALSE';

type ExtractedRouterObject = {
  endPoint: string;
  status: UrlMatchStatus;
  params: Record<string, string | number>;
};

type ResponseStruct =
  | {
      status: 'success';
      statusCode: number;
      data: unknown;
    }
  | {
      status: 'fail';
      statusCode: number;
      message: string;
    };
