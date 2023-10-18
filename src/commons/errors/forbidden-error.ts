import { ClientError } from '~/commons/errors/client-error';

/**
 * 401 Error
 */
export class ForbiddenError extends ClientError {
  public statusCode = 403;

  constructor(public message: string) {
    super(message);
  }
}
