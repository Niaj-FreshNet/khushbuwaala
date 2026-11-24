import Link from "next/link";
import { FAMILY_PAGES, NOTE_PAGES } from "@/config/scentPages";

// a family or note with its own page links there (search engines can follow it); others open the filtered shop
const familyHref = (id: string) => (FAMILY_PAGES[id] ? `/scents/${id}` : `/shop?families=${id}`);
const noteHref = (id: string) => (NOTE_PAGES[id] ? `/notes/${id}` : `/shop?notes=${id}`);

// "Scent at a glance": the product's fragrance facts in plain words, each one a link to more
// perfumes like it. Server component: the links are in the HTML for customers and search engines.
// Data comes from the API's `profile` (built from what the admin typed; nothing is invented), so
// a product with little data simply shows less, and one with none shows nothing.

type Entry = { id: string; label: string; hint?: string };

export type ProductProfile = {
  families?: Entry[];
  mainFamilies?: Entry[];
  notes?: Entry[];
  longevity?: Entry | null;
  projection?: Entry | null;
  occasions?: Entry[];
  times?: Entry[];
  seasons?: Entry[];
};

const chip =
  "inline-flex h-9 items-center rounded-full border border-stone-200 bg-white px-3 text-[13px] font-medium text-stone-800 hover:border-emerald-600 hover:text-emerald-900";

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="pt-1.5 text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ScentProfile({ profile, name }: { profile?: ProductProfile | null; name: string }) {
  if (!profile) return null;
  const main = profile.mainFamilies?.length ? profile.mainFamilies : (profile.families ?? []).slice(0, 3);
  const notes = (profile.notes ?? []).slice(0, 8);
  const occasions = [...(profile.occasions ?? []).map((o) => ({ ...o, key: "occasions" })), ...(profile.times ?? []).map((o) => ({ ...o, key: "times" }))].slice(0, 6);
  const hasStrength = Boolean(profile.longevity || profile.projection);

  if (!main.length && !notes.length && !hasStrength && !occasions.length) return null;

  return (
    <section aria-labelledby="scent-profile-heading" className="rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3 sm:px-5">
      <h2 id="scent-profile-heading" className="text-lg font-bold text-stone-900 sm:text-xl">
        {name} at a glance
      </h2>
      <p className="text-[13px] text-stone-600">Tap anything to see more perfumes like it.</p>

      <dl className="mt-1 divide-y divide-stone-200/70">
        {main.length > 0 && (
          <Row title="Smells">
            <ul className="space-y-1.5">
              {main.map((f) => (
                <li key={f.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Link href={familyHref(f.id)} className={chip}>
                    {f.label}
                  </Link>
                  {f.hint && <span className="text-[13px] text-stone-600">{f.hint}</span>}
                </li>
              ))}
            </ul>
          </Row>
        )}

        {notes.length > 0 && (
          <Row title="You can pick out">
            <div className="flex flex-wrap gap-1.5">
              {notes.map((n) => (
                <Link key={n.id} href={noteHref(n.id)} className={chip}>
                  {n.label}
                </Link>
              ))}
            </div>
          </Row>
        )}

        {hasStrength && (
          <Row title="Strength">
            <ul className="space-y-1 text-sm text-stone-800">
              {profile.longevity && (
                <li>
                  <Link href={`/shop?longevity=${profile.longevity.id}`} className="font-semibold underline decoration-stone-300 underline-offset-2 hover:decoration-emerald-600">
                    {profile.longevity.label}
                  </Link>
                  {profile.longevity.hint && <span className="text-stone-600"> — {profile.longevity.hint.toLowerCase()}</span>}
                </li>
              )}
              {profile.projection && (
                <li>
                  <Link href={`/shop?projection=${profile.projection.id}`} className="font-semibold underline decoration-stone-300 underline-offset-2 hover:decoration-emerald-600">
                    {profile.projection.label === "Moderate" ? "Moderate reach" : profile.projection.label}
                  </Link>
                  {profile.projection.hint && <span className="text-stone-600"> — {profile.projection.hint.toLowerCase()}</span>}
                </li>
              )}
            </ul>
            <p className="mt-1.5 text-xs text-stone-500">How long any perfume lasts depends on your skin, the weather and how much you apply.</p>
          </Row>
        )}

        {occasions.length > 0 && (
          <Row title="Good for">
            <div className="flex flex-wrap gap-1.5">
              {occasions.map((o) => (
                <Link key={`${o.key}:${o.id}`} href={`/shop?${o.key}=${o.id}`} className={chip}>
                  {o.label}
                </Link>
              ))}
            </div>
          </Row>
        )}
      </dl>
    </section>
  );
}
