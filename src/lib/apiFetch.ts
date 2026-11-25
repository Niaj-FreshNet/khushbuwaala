// A fetch that gives up after a few seconds.
//
// Pages ask the shop's API for their data while they are being drawn on the server (and while
// the site is being built). A plain fetch waits for as long as the other side keeps the line
// open, so an API that accepts the call but never answers froze every page for a minute and
// failed the whole build. With a limit, the caller's own fallback is used instead (an empty
// list, the default banners) and the page is still drawn.

const DEFAULT_TIMEOUT_MS = 8000;

export function apiFetch(url: string, init: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const limit = AbortSignal.timeout(timeoutMs);
  const signal = init.signal ? AbortSignal.any([init.signal, limit]) : limit;
  return fetch(url, { ...init, signal });
}
