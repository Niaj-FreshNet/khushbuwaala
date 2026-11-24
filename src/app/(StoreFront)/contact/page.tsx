import { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin, PackageSearch } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Khushbuwaala – Call, WhatsApp or Message Us",
  description:
    "Talk to Khushbuwaala about a perfume, an order or a delivery: call, WhatsApp, Messenger or email. Showroom in South Banasree, Dhaka.",
  alternates: { canonical: "/contact" },
};

// This page used to be a copy of the store locator. Someone who taps "Contact" wants to reach
// the shop, so the ways to do that come first; the showroom is one of them.
const ways = [
  {
    icon: Phone,
    title: "Call us",
    detail: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone}`,
    cta: "Call now",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "Ask about a scent or place an order",
    href: `https://wa.me/${siteConfig.contact.whatsapp}`,
    cta: "Open WhatsApp",
  },
  {
    icon: MessageCircle,
    title: "Messenger",
    detail: "Message our Facebook page",
    href: "https://m.me/111483794112905",
    cta: "Open Messenger",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "khushbuwaala@gmail.com",
    href: "mailto:khushbuwaala@gmail.com",
    cta: "Send an email",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Contact us</h1>
        <p className="mt-2 text-gray-700">
          Not sure which perfume to pick, or have a question about an order? Reach us any of these ways.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ways.map((w) => (
            <a
              key={w.title}
              href={w.href}
              target={w.href.startsWith("http") ? "_blank" : undefined}
              rel={w.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-emerald-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <w.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-gray-900">{w.title}</span>
                <span className="block truncate text-sm text-gray-600">{w.detail}</span>
                <span className="mt-0.5 block text-sm font-semibold text-emerald-700">{w.cta}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
            <div>
              <h2 className="font-semibold text-gray-900">Visit the showroom</h2>
              <p className="mt-1 text-sm text-gray-700">
                Shop-G/138, Eastern Banabithi Shopping Complex, South Banasree, Khilgaon, Dhaka-1219
              </p>
              <Link href="/stores" className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline underline-offset-2">
                Directions and opening hours
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <PackageSearch className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
            <div>
              <h2 className="font-semibold text-gray-900">Already ordered?</h2>
              <p className="mt-1 text-sm text-gray-700">Check where your parcel is with your order ID or phone number.</p>
              <Link href="/track-order" className="mt-2 inline-block text-sm font-semibold text-emerald-700 underline underline-offset-2">
                Track your order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
