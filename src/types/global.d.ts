// Things the shop's own scripts and Google Tag Manager put on the browser window.
export {};

declare global {
  interface Window {
    /** Google Tag Manager's event queue. Shop code sends events through `kwDataLayerPush`. */
    dataLayer?: unknown[];
    /** Stops the product-view event firing twice for the same product within a moment. */
    __kw_last_view_item?: { key: string; t: number };
  }
}
