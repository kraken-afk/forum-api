import type { Request, ServerResponse } from '~/core/mod';
import { Send } from '~/core/mod';

export function get(req: Request, res: ServerResponse) {
  return Send.new({
    name: 'Romeo',
    age: 18,
  });
}
