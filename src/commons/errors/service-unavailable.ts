export class ServiceUnavailable extends Error {
  public statusCode = 503;

  constructor(public message: string) {
    super(message);
  }
}
