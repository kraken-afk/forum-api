import { type Request, Send } from '~/interfaces/http/core/mod';
import { Users } from '~/use-cases/users';

export async function POST(req: Request) {
  const payload = JSON.parse(req.payload) as UserPayload;
  const newUser = await Users.createUser(payload);

  return Send.new({ addedUser: newUser }, { status: 201 });
}
