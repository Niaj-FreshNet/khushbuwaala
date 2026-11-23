/**
 * Sends shop events to Google Tag Manager, holding them until Tag Manager is running.
 *
 * Tag Manager is loaded late so pages open faster. An event pushed before it loads is replayed
 * before Tag Manager's own start-up step, which is when the Meta pixel is set up, and Meta then
 * never receives that event (seen in Meta's Test Events on 2026-11-23: a product view on page
 * load was lost, the same event sent after start-up arrived). So early events wait here and are
 * handed over, in order, once Tag Manager is ready.
 */

type Row = Record<string, unknown>;

const CHECK_EVERY_MS = 200;
// If Tag Manager has not appeared by then (blocked or very slow), hand the events over anyway.
const GIVE_UP_AFTER_MS = 20000;

let held: Row[] = [];
let timer: ReturnType<typeof setInterval> | null = null;

function tagManagerReady(): boolean {
  const gtm = (window as unknown as { google_tag_manager?: Record<string, unknown> }).google_tag_manager;
  return !!gtm && Object.keys(gtm).some((key) => key.startsWith("GTM-"));
}

function send(row: Row) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(row);
}

function flush() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  const rows = held;
  held = [];
  rows.forEach(send);
}

export function kwDataLayerPush(row: Row) {
  if (typeof window === "undefined") return;

  if (tagManagerReady()) {
    if (held.length) flush();
    send(row);
    return;
  }

  held.push(row);
  if (timer) return;

  let waited = 0;
  timer = setInterval(() => {
    waited += CHECK_EVERY_MS;
    if (tagManagerReady() || waited >= GIVE_UP_AFTER_MS) flush();
  }, CHECK_EVERY_MS);
}
