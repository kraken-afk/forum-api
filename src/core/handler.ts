import type {IncomingMessage, ServerResponse} from 'http';

export function notFoundHandler(
	request: IncomingMessage,
	response: ServerResponse,
) {
	response.statusCode = 404;
	response.end('url not found');
}
