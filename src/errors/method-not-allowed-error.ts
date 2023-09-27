import { ClientError } from '~/errors/client-error';

export class MethodNotAllowedError extends ClientError {
  public statusCode = 405;

  constructor(public message: string) {
    super(message);
  }
}
