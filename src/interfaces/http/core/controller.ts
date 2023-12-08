/**
 * Matching url with routes and return status of route.
 * ```ts
 * return ({
 * 	endpoint: string;
 *		status: boolean;
 *		params: Record<string, string | number>;
 *	});
 * ```
 */

export function controller(
  routeStr: string,
  urlStr: string,
): ExtractedRouterObject {
  const route = routeStr.match(/(?<=\/)[^\/.]+(?=\/)?/g) ?? ['/'];
  const endpoint = urlStr.match(/(?<=\/)[^\/.]+(?=\/)?/g) ?? ['/'];
  const params = new Map();
  const conclusion: ExtractedRouterObject = {
    endpoint: routeStr,
    status: true,
    params: {},
  };

  if (route.length !== endpoint.length) {
    conclusion.status = false;
    return conclusion;
  }

  for (let i = 0; i < endpoint.length; i++) {
    const isParam = /\[.+\]/.test(route[i]);

    if (endpoint[i].includes('?')) {
      const path = endpoint[i].replace(/\?.+/, '');
      const parameters = endpoint[i].match(/\w+\=\w+/g); // array of "key=value"

      if (path === route[i] || isParam) {
        for (const parameter of parameters!) {
          const [key, value] = parameter.split('=');
          params.set(key, value);
        }

        if (isParam) {
          const key = route[i].replace(/\[|\]/g, '');
          params.set(key, path);
        }

        continue;
      } else {
        conclusion.status = false;
        break;
      }
    }

    if (isParam) {
      const key = route[i].replace(/\[|\]/g, '');
      params.set(key, endpoint[i]);
      continue;
    }

    if (endpoint[i] !== route[i]) {
      conclusion.status = false;
      break;
    }
  }

  conclusion.params = Object.fromEntries(params);
  return conclusion;
}
