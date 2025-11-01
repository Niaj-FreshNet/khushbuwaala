import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Exchange Policy | KhushbuWaala Perfumes",
  description: "Exchange your perfume within 7 days if unused and in original condition.",
};

export default function ExchangePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Exchange Policy</CardTitle>
            <Badge variant="secondary" className="mt-2">7-Day Exchange Window</Badge>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              We allow exchange within <strong>7 days</strong> of delivery, subject to conditions.
            </p>

            <h2>Exchange Conditions</h2>
            <ul>
              <li>Unused or minimally tested</li>
              <li>Original packaging, tags, barcode, receipt</li>
              <li>Request within 7 days</li>
              <li>No instant exchange with delivery agent</li>
            </ul>

            <h2>Lost Items?</h2>
            <p>
              We may verify via phone. Inner packaging required.
            </p>

            <h2>How to Exchange?</h2>
            <p>
              Call or message <strong>+8801566395807</strong>. Agent will collect and deliver replacement.
            </p>

            <div className="border-t pt-6 mt-8">
              <h2>Contact Us</h2>
              <p>
                <strong>Phone:</strong> <a href="tel:+8801566395807" className="text-blue-600">+8801566395807</a><br />
                <strong>Email:</strong> <a href="mailto:khushbuwaala@gmail.com" className="text-blue-600">khushbuwaala@gmail.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}