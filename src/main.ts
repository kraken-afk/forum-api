import { config } from 'dotenv';
import { server } from '~/interfaces/http/core/server';

const port = parseInt(process.env.PORT ?? '3000', 10);
const host = process.env?.HOST as string;

void config();
server('src/api', host, port + 1);
