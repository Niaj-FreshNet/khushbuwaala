import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "About Khushbuwaala – 8+ Years of Fragrance Expertise" },
  description:
    "Khushbuwaala has been selling perfume oils, attars and oud from Dhaka since 2020, built on more than eight years of working with fragrance. Who we are and how we help you choose.",
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: "About Khushbuwaala",
    description: "A fragrance shop from Dhaka, built on 8+ years of working with perfume oils, attars and oud.",
    url: `${siteConfig.url}/about`,
  },
};

// Wording agreed with the owner (2026-11-23): the shop is "since 2020", the experience is
// "8+ years in fragrance". No customer counts, brand counts or follower numbers.
const WAYS_WE_HELP = [
  {
    title: "Start from what you like",
    body: "You do not need to know perfume names. Tell the shop you want something fresh, sweet or woody, with a touch of oud or rose, and it narrows the collection for you.",
    href: "/shop",
    link: "Browse by scent",
  },
  {
    title: "Honest descriptions",
    body: "Every perfume lists its main scent families and notes, and says in plain words how long it tends to last and how far it reaches. Skin and weather change that, so we do not promise hours.",
    href: "/shop?longevity=long,very_long",
    link: "See the long-lasting ones",
  },
  {
    title: "Ask a person",
    body: "If you are choosing a gift or cannot decide between two, message us. We would rather help you pick the right one than sell you the wrong one.",
    href: `https://wa.me/${siteConfig.contact.whatsapp}`,
    link: "Message us on WhatsApp",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-3xl px-4 pb-14 pt-8 sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Our story</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          We have spent more than eight years around fragrance. Khushbuwaala is where we share it.
        </h1>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stone-700 sm:text-base">
          <p>
            Khushbuwaala opened in Dhaka in 2020. The work behind it started earlier: over eight years of smelling,
            comparing and selecting perfume oils, attars and oud, and of listening to what people actually ask for when
            they say “something nice that lasts”.
          </p>
          <p>
            That experience is why most of what we sell is concentrated perfume oil rather than spray. A small bottle goes a
            long way, it sits close to the skin in our heat and humidity, and it lets you own several scents for the
            price of one spray bottle. Alongside the oils you will find Arabian-style attars, oud blends, natural attars
            such as ruh khus, a few brand perfumes, and gift sets.
          </p>
          <p>
            We choose each fragrance ourselves and describe it the way we would across a shop counter: what it smells
            like, when it suits, and how strong it is.
          </p>
        </div>

        <h2 className="mt-10 text-xl font-bold text-stone-900">How we help you choose</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {WAYS_WE_HELP.map((item) => (
            <li key={item.title} className="flex flex-col rounded-2xl border border-stone-200 p-4">
              <h3 className="text-[15px] font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-stone-600">{item.body}</p>
              <Link href={item.href} className="mt-3 text-sm font-semibold text-emerald-800 underline underline-offset-2">
                {item.link}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold text-stone-900">Ordering from us</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-700 sm:text-base">
          We deliver across Bangladesh and you can pay cash on delivery. You are also welcome at our showroom to try
          before you buy.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/shop" className="inline-flex h-11 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white">
            Find a perfume
          </Link>
          <Link href="/stores" className="inline-flex h-11 items-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-800">
            Visit the showroom
          </Link>
          <Link href="/contact" className="inline-flex h-11 items-center rounded-full border border-stone-300 px-5 text-sm font-semibold text-stone-800">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
