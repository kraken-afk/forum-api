import { ClientError } from '~/commons/errors/client-error';

/**
 * 404 Error
 */
export class NotFoundError extends ClientError {
  public statusCode = 404;

  constructor(public message: string) {
    super(message);
  }
}
