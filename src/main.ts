import { config } from 'dotenv';
import { server } from '~/interfaces/http/core/server';

void config();

const port =
  process.env.PLATFORM === 'CONTAINER'
    ? 5000
    : parseInt(process.env.PORT ?? '3000', 10);
const host = process.env?.HOST as string;

server('src/api', host, port);
