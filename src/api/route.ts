export function get() {
	return new Response(
		JSON.stringify({
			name: 'Romeo',
			age: 18,
		}),
		{
			status: 201,
			headers: {
				'Content-Type': 'application/json',
				authorization: 'bearer 1223422',
			},
		},
	);
}

export function post() {
	return new Response('Hello POST');
}
