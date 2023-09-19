import {createServer} from 'node:http';
import {prepareRoutesHandler} from '~/core/mod';
import {log} from '~/libs/log';

export async function server() {
	const PORT = parseInt(process.env?.port || '3000');
	const HOST = process.env?.host as string;
	const httpServer = createServer();

	const router = await prepareRoutesHandler();
	httpServer.on('request', (request, response) => {
		console.log(request.url);
		console.log(request.method);

		response.end('Ok');
	});

	httpServer.listen(PORT, HOST);
	log.info('Listening to', `http://${HOST}:${PORT}`);
}
