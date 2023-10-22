import type { Request, ServerResponse } from '~/infrastructure/core/mod';
import { Send } from '~/infrastructure/core/mod';

export function GET(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
    threadId: req.params?.threadId,
  });
}
