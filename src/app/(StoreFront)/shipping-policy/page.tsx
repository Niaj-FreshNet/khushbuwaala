import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy | Khushbuwaala Perfumes",
  description:
    "Delivery across Bangladesh from Khushbuwaala: ৳60 inside Dhaka, ৳120 outside Dhaka, free on orders of ৳1,000 or more. Cash on delivery available.",
};

// The charges and times here are the ones checkout applies (৳60 Dhaka, ৳120 outside, free from
// ৳1,000) and the delivery times the owner gave on 2026-11-23. This page used to say ৳70 / ৳100
// and 2–5 days, which did not match what customers were charged.
const rates = [
  { where: "Inside Dhaka", cost: "৳60", time: "Within 1 day" },
  { where: "Outside Dhaka", cost: "৳120", time: "1–2 days" },
];

export default function ShippingPolicy() {
  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shipping Policy</h1>
          <p className="mt-3 text-gray-700">
            We deliver across Bangladesh. One delivery address per order. You can pay cash on delivery or online.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 sm:text-xl">Delivery charge and time</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {rates.map((r) => (
              <div key={r.where} className="rounded-xl border border-gray-200 p-4">
                <p className="font-semibold text-gray-900">{r.where}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{r.cost}</p>
                <p className="mt-1 text-sm text-gray-600">{r.time}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-medium text-emerald-900">
            Free delivery on orders of ৳1,000 or more, anywhere in Bangladesh.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            The charge is shown at checkout before you place the order. Delivery times are counted from when the order
            is confirmed and can be longer during public holidays or bad weather.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 sm:text-xl">Outside Bangladesh</h2>
          <p className="mt-2 text-gray-700">
            The cost depends on weight and destination. Please contact us for a quote before ordering.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 sm:text-xl">Tracking your order</h2>
          <p className="mt-2 text-gray-700">
            Use{" "}
            <Link href="/track-order" className="font-semibold text-emerald-700 underline underline-offset-2">
              Track Order
            </Link>{" "}
            with your order ID or phone number, or call us.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 sm:text-xl">If the delivery is late</h2>
          <p className="mt-2 text-gray-700">Contact us and we will check with the courier and get back to you.</p>

          <h2 className="mt-8 text-lg font-semibold text-gray-900 sm:text-xl">If you are not home</h2>
          <p className="mt-2 text-gray-700">
            Anyone at the address can receive the parcel. For cash on delivery, the amount is paid to the delivery
            person.
          </p>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Contact us</h2>
            <p className="mt-2 text-gray-700">
              Phone:{" "}
              <a href="tel:+8801777152588" className="font-semibold text-emerald-700">
                +8801777152588
              </a>
              <br />
              Email:{" "}
              <a href="mailto:khushbuwaala@gmail.com" className="font-semibold text-emerald-700">
                khushbuwaala@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
