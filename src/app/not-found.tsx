import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

// A wrong or old link should still lead somewhere useful: straight to the perfumes, or to help.
// (This page has no site header, so it carries its own way back.)
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5 py-10">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="text-lg font-bold tracking-tight text-emerald-800">
          Khushbuwaala
        </Link>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          We could not find that page
        </h1>
        <p className="mt-3 text-gray-600">
          The link may be old or mistyped. The perfumes are all still here.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-base font-bold text-white hover:bg-emerald-800"
          >
            Browse all perfumes
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 px-5 text-base font-semibold text-gray-900 hover:border-emerald-600"
          >
            Go to the home page
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Looking for an order?{" "}
          <Link href="/track-order" className="font-semibold text-emerald-700 underline underline-offset-2">
            Track it here
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-emerald-700 underline underline-offset-2">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
