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
  const { pathname, searchParams } = new URL(`http://userhost${urlStr}`);
  const route = routeStr.split('/');
  const url = pathname.split('/');
  const len = route.length > url.length ? route.length : url.length;
  const rgx = /\[.+\]/;
  const params = new Map<string, string | number>();
  const extractedRouterObject: ExtractedRouterObject = {
    endPoint: routeStr,
    status: 'TRUE',
    params: {},
  };

  for (let i = 0; i < len; i++) {
    const r = route[i];
    const u = url[i];

    if (r === u) continue;
    if (rgx.test(r) && u) {
      const key = rgx.exec(r)![0].replace(/[[\]]/g, '');

      extractedRouterObject.status = 'PARAMS';
      params.set(key, u);
    } else {
      extractedRouterObject.status = 'FALSE';
      break;
    }
  }

  for (const [key, value] of searchParams) {
    const val = /^[0-9\.]+$/.test(value) ? +value : value;

    params.set(key, val);
  }

  extractedRouterObject.params = Object.fromEntries(params);
  return extractedRouterObject;
}
