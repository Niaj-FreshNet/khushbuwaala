import type { ImgHTMLAttributes } from "react";

// A plain <img>, for pictures the shop's optimised image component cannot take: pictures customers
// add themselves (review photos, profile pictures, a preview of a file just chosen) can come from
// any address or be embedded in the page, and next/image only accepts addresses listed in the
// shop's settings. Small thumbnails only; product photos use next/image.
export function PlainImage({ alt = "", loading = "lazy", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading={loading} decoding="async" {...rest} />;
}
