import { IncomingMessage, ServerResponse } from 'node:http';
import { Send } from '~/core/mod';

export function get(req: IncomingMessage, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18
  })
}