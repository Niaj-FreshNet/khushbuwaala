import Link from "next/link"

// "Where do I start?" for visitors who do not know a perfume's name (most people arriving from an
// ad). Every chip is an ordinary shop link, so it always shows what is really in the collection.
const GROUPS: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "I want to smell…",
    items: [
      { label: "Fresh & clean", href: "/scents/fresh" },
      { label: "Sweet", href: "/scents/sweet" },
      { label: "Woody", href: "/scents/woody" },
      { label: "Floral", href: "/scents/floral" },
      { label: "Musky & soft", href: "/scents/musky" },
      { label: "Spicy & warm", href: "/scents/spicy" },
    ],
  },
  {
    title: "With a touch of…",
    items: [
      { label: "Oud", href: "/notes/oud" },
      { label: "Rose", href: "/notes/rose" },
      { label: "Musk", href: "/notes/musk" },
      { label: "Vanilla", href: "/notes/vanilla" },
      { label: "Sandalwood", href: "/notes/sandalwood" },
      { label: "Saffron", href: "/notes/saffron" },
    ],
  },
  {
    title: "It should be…",
    items: [
      { label: "Long-lasting", href: "/shop?longevity=long,very_long" },
      { label: "Noticed across a room", href: "/shop?projection=strong" },
      { label: "Right for the office", href: "/shop?occasions=office" },
      { label: "For a special evening", href: "/shop?occasions=party,date" },
      { label: "Under ৳500", href: "/shop?maxPrice=500" },
      { label: "A gift", href: "/gifts-and-packages" },
    ],
  },
]

export function HomeDiscovery() {
  return (
    <section aria-labelledby="discover-heading" className="mx-auto mb-8 w-full max-w-7xl px-3 sm:mb-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-stone-200 bg-stone-50/70 px-4 py-5 sm:px-8 sm:py-7">
        <h2 id="discover-heading" className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
          Not sure which perfume? Start with what you like.
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
          You do not need to know names or notes. Pick anything below and we will show the perfumes that fit. You can
          combine choices afterwards.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3 md:gap-6">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">{group.title}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex h-10 items-center rounded-full border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-800 hover:border-emerald-600 hover:text-emerald-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
