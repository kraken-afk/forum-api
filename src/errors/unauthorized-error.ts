import { ClientError } from '~/errors/client-error';

/**
 * 401 Error
 */
export class UnauthorizedError extends ClientError {
  public statusCode = 401;

  constructor(public message: string) {
    super(message);
  }
}
