/// <reference path="@types/node" />

type HttpMethodKey = 'get' | 'post' | 'delete' | 'put' | 'patch';
type ServerState = 'SUCCESS' | 'ERROR' | 'NOT FOUND';
type Request = IncomingMessage;
type Response = ServerResponse;
type RouterFunc = (request: Request, response: Response) => Response;
type AppRouter = Map<string, Record<Partial<HttpMethodKey>, RouterFunc>>;

declare const __OUT_DIR__: string;
