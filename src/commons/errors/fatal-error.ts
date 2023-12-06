export class FatalError extends Error {
  public statusCode = 500;

  constructor(public message: string) {
    super(message);
  }
}
