import {createServer} from 'node:http';
import {notFoundHandler} from '~/core/handler';
import {prepareRoutesHandler} from '~/core/mod';
import {log} from '~/libs/log';

export async function server() {
	const port = parseInt(process.env.port ?? '3000', 10);
	const host = process.env?.host;
	const httpServer = createServer();

	const router = await prepareRoutesHandler();
	httpServer.on('request', async (request, response) => {
		console.log(request.url);

		if (!router.has(request.url!)) {
			notFoundHandler(request, response);
		}
	});

	httpServer.listen(port, host);
	log.info('Listening to', `http://${host}:${port}`);
}
