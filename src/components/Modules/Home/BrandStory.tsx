import Link from "next/link"
import { siteConfig } from "@/config/site"

// Who is behind the shop, in the wording agreed with the owner: Khushbuwaala since 2020,
// 8+ years of working with fragrance. No counts, awards or badges.
export function BrandStory() {
  return (
    <section aria-labelledby="story-heading" className="mx-auto w-full max-w-7xl 2xl:max-w-384 3xl:max-w-[1800px] px-3 sm:px-4 lg:px-6 2xl:px-8 mb-8 sm:mb-10">
      <div className="grid gap-5 rounded-3xl bg-emerald-950 px-5 py-7 text-emerald-50 sm:px-10 sm:py-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">8+ years in fragrance</p>
          <h2 id="story-heading" className="mt-2 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl md:text-[28px]">
            We choose every scent ourselves, and tell you plainly what it is like.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100/90 sm:text-[15px]">
            Khushbuwaala opened in Dhaka in 2020, after years of working with perfume oils, attars and oud. Each
            perfume here comes with its real notes, how long it tends to last and when it suits, so you can choose
            with confidence from your phone.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/about" className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-emerald-950">
              Our story
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              className="inline-flex h-11 items-center rounded-full border border-emerald-300/50 px-5 text-sm font-semibold text-white"
            >
              Ask us to recommend one
            </a>
          </div>
        </div>

        <ul className="space-y-3 text-sm">
          {[
            ["Concentrated perfume oils", "A few drops on the pulse points go a long way."],
            ["Sizes from 3 ml", "Try a scent before you commit to a bigger bottle."],
            ["Cash on delivery, all over Bangladesh", "Free delivery on orders of ৳1,000 or more."],
            ["Exchange within 7 days", "If something is not right, we sort it out. Terms apply."],
          ].map(([title, body]) => (
            <li key={title} className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="font-semibold text-white">{title}</p>
              <p className="text-emerald-100/80">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
