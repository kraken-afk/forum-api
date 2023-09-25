export class FatalError extends Error {
	public statusCode = 0;

	constructor(public message: string) {
		super(message);
	}
}
