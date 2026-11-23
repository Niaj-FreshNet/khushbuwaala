import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopListing, shopMetadata, type ShopSearchParams } from "@/components/Modules/Shop/ShopListing";
import { NOTE_PAGES, notePageConfig } from "@/config/scentPages";

// One page per popular note, e.g. /notes/oud. Wording lives in src/config/scentPages.ts
type Props = { params: Promise<{ note: string }>; searchParams: ShopSearchParams };

export function generateStaticParams() {
  return Object.keys(NOTE_PAGES).map((note) => ({ note }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const config = notePageConfig((await params).note);
  if (!config) return { title: "Not found", robots: { index: false, follow: true } };
  return shopMetadata(config, searchParams);
}

export default async function Page({ params, searchParams }: Props) {
  const config = notePageConfig((await params).note);
  if (!config) notFound();
  return <ShopListing config={config} searchParams={searchParams} />;
}
