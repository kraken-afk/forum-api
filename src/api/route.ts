import type { Request, ServerResponse } from '~/interfaces/http/core/mod';
import { Send } from '~/interfaces/http/core/mod';

export function GET(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
    method: 'GET',
  });
}

export function POST(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
    method: 'POST',
  });
}
