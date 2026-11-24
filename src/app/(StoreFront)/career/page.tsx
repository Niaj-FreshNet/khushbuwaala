import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Khushbuwaala",
  description:
    "Interested in working with Khushbuwaala? There are no open positions listed right now, but you can send us your CV.",
  alternates: { canonical: "/career" },
};

// The two jobs that used to be listed here were sample content, not real openings (owner,
// 2026-11-24). The page stays, and says honestly that nothing is open at the moment.
export default function CareerPage() {
  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Careers</h1>
          <p className="mt-3 text-gray-700">
            We are a small team that loves fragrance. There are no open positions listed right now.
          </p>
          <p className="mt-3 text-gray-700">
            If you would like to work with us in the future, send your CV and a few lines about yourself. We keep
            every message and get in touch when something suitable opens.
          </p>
          <a
            href="mailto:khushbuwaala@gmail.com?subject=Working%20at%20Khushbuwaala"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-base font-bold text-white hover:bg-emerald-800"
          >
            Email your CV
          </a>
          <p className="mt-3 text-sm text-gray-600">khushbuwaala@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
