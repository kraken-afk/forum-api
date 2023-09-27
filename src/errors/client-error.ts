export class ClientError extends Error {
  public statusCode = 400;

  constructor(public message: string) {
    super(message);
  }
}
