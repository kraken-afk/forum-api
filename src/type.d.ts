/// <reference path="@types/node" />

type HttpMethodKey = 'get' | 'post' | 'delete' | 'put' | 'patch';
type Request = IncomingMessage;
type Response = ServerResponse;
type RouterFunc = (request: Request, response: Response) => Response;
