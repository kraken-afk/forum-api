/**
 * Matching url with routes and return status of route.
 * ```ts
 * return ({
 * 	endPoint: string;
 *		status: 'TRUE' | 'PARAMS' | 'FALSE';
 *		params: Record<string, string>;
 *	});
 * ```
 */
export function controller(
  routeStr: string,
  urlStr: string,
): ExtractedRouterObject {
  const route = routeStr.split('/');
  const url = urlStr.split('/');
  const len = route.length > url.length ? route.length : url.length;
  const rgx = /\[.+\]/;
  const extractedRouterObject: ExtractedRouterObject = {
    endPoint: routeStr,
    status: 'TRUE',
    params: {},
  };

  for (let i = 0; i < len; i++) {
    const r = route[i];
    const u = url[i];

    if (r === u) continue;
    if (rgx.test(r)) {
      const key = rgx.exec(r)![0].replace(/[[\]]/g, '');

      extractedRouterObject.status = 'PARAMS';
      extractedRouterObject.params[key] = u;
    } else {
      extractedRouterObject.status = 'FALSE';
      break;
    }
  }

  return extractedRouterObject;
}
