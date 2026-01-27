import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Exchange Policy | KhushbuWaala Perfumes",
  description: "Understand our 7-day exchange and return policy for perfumes at KhushbuWaala Perfumes.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Refund & Exchange Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700 space-y-6">
            {/* <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Samples are gifts</AlertTitle>
              <AlertDescription>Samples cannot be chosen or returned.</AlertDescription>
            </Alert> */}

            <h2>Exchange & Return Window</h2>
            <p>
              You may apply for exchange or return within <strong>7 days</strong> of receiving the product.
            </p>
            <p className="text-red-600 font-semibold">
              RETURN AND EXCHANGE ARE NOT AVAILABLE DURING DISCOUNT CAMPAIGNS UNLESS STATED.
            </p>

            <h2>Conditions for Exchange & Return</h2>
            <ul>
              <li>Product must be unused (testing allowed)</li>
              <li>Request within 7 days of purchase</li>
              <li>Original packaging, tags, barcode, and receipt required</li>
              <li>Product must be received first — no instant exchange/refund with delivery agent</li>
            </ul>

            <h2>Lost Receipt / Packaging?</h2>
            <p>
              We may verify via your registered phone number. Inner packaging is mandatory.
            </p>

            <h2>How to Return?</h2>
            <p>
              Contact us at <strong>+8801566395807</strong> or via WhatsApp/Facebook/Instagram. A delivery agent will collect and deliver exchange (if applicable).
            </p>
            <p>
              Refunds/exchanges processed within <strong>7–10 days</strong>.
            </p>

            <div className="border-t pt-6 mt-8">
              <h2>Contact Us</h2>
              <p>
                <strong>Phone:</strong> <a href="tel:+8801566395807" className="text-blue-600">+8801566395807</a><br />
                <strong>Email:</strong> <a href="mailto:khushbuwaala@gmail.com" className="text-blue-600">khushbuwaala@gmail.com</a><br />
                <strong>Hours:</strong> 10:00 AM – 10:00 PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}