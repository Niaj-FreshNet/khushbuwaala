// The message to show when a request fails. When the shop's server answered with a reason
// (`{ message }`) that reason is shown; for anything else (a dropped connection, a browser error)
// the plain fallback text is shown instead of a technical one.
export function serverMessage(err: unknown): string | null {
  if (!err || typeof err !== "object") return null;
  const data = (err as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : null;
}

export function apiErrorMessage(err: unknown, fallback: string): string {
  return serverMessage(err) ?? fallback;
}
