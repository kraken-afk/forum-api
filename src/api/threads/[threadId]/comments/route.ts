import type { Request, ServerResponse } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';

export function GET(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
    endpoint: 'comments',
    threadId: req.params?.threadId,
  });
}

export function POST(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
    endpoint: 'comments',
    threadId: req.params?.threadId,
  });
}
