/// <reference path="./node_modules/@types/node/http.d.ts" />

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type HttpMethodKey = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
type ServerState = 'SUCCESS' | 'ERROR' | 'NOT FOUND';
type AppRouter = Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>;

declare const __OUT_DIR__: string;

type ExtractedRouterObject = {
  endpoint: string;
  status: boolean;
  params: Record<string, string | number>;
};

type Validator = {
  success: boolean;
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
