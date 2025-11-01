import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions | KhushbuWaala Perfumes",
  description: "By using KhushbuWaala Perfumes, you agree to our terms of service, intellectual property, and liability policies.",
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Terms & Conditions</CardTitle>
            <p className="text-sm text-gray-500 mt-2">Last updated: November 02, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              Welcome to <strong>KhushbuWaala Perfumes</strong>. By using our website, app, or services, you agree to these Terms.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content is owned by KhushbuWaala Perfumes. No reproduction without permission.
            </p>

            <h2>User Content</h2>
            <p>
              You grant us a non-exclusive license to use content you post. It must not violate copyrights.
            </p>

            <h2>Termination</h2>
            <p>
              We may suspend or terminate access for violations without notice.
            </p>

            <h2>Product Accuracy</h2>
            <p>
              Colors may vary due to screen settings. Return if not as described (without breaking seal).
            </p>

            <h2>Cancellation</h2>
            <p>
              Cancel before confirmation call. No cancellation after agent dispatch.
            </p>

            <h2>Pricing</h2>
            <p>
              Price at purchase is final. Includes VAT. Delivery extra.
            </p>

            <h2>Force Majeure</h2>
            <p>
              Not liable for delays due to natural disasters, strikes, or third-party failures.
            </p>

            <h2>Limitations of Liability</h2>
            <p>
              Liability limited to product cost. No indirect or consequential damages.
            </p>

            <h2>Governing Law</h2>
            <p>
              Governed by the laws of <strong>Bangladesh</strong>.
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