import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | KhushbuWaala Perfumes",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information at KhushbuWaala Perfumes.",
  openGraph: {
    title: "Privacy Policy | KhushbuWaala Perfumes",
    description: "Your privacy matters. Learn how we protect your data.",
    url: "https://www.khushbuwaala.com/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <CardDescription className="mt-2">
              Last updated: November 02, 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              We expect you to carefully go through this Privacy Policy before using <strong>KhushbuWaala Perfumes</strong>. Here, “We”, “Us”, “Our”, “Website”, “Site”, “System”, “Platforms” includes (All Social Media, Mobile App, Wearable Technology) will refer to <strong>KhushbuWaala Perfumes</strong> and “You”, “Your”, “User” will refer to Customers and Visitors.
            </p>

            <h2>Regarding the Information Collected</h2>
            <p>
              When you visit the website and its subpages, use our services, place an order, make a purchase, participate in our Loyalty Program, or contact us, we collect your identifiable information, for example, your name, phone number, email address, etc. We also keep records of your browsing history and interests to enhance your user experience.
            </p>

            <h3>Personal Identification Information (PII)</h3>
            <p>
              We may collect PII when you register, fill forms, or use services. You may visit anonymously. We only collect PII if voluntarily submitted.
            </p>

            <h3>Non-Personal Identification Information</h3>
            <p>
              This includes browser type, OS, ISP, and connection details to improve site performance.
            </p>

            <h3>Browser Cookies</h3>
            <p>
              We use cookies to personalize your experience. You can disable cookies in your browser, but some features may not work.
            </p>

            <h2>How We Use Collected Information</h2>
            <ul>
              <li><strong>Improve customer service:</strong> Respond efficiently to support requests.</li>
              <li><strong>Run surveys & promotions:</strong> Enhance user experience.</li>
              <li><strong>Send periodic emails:</strong> Updates, newsletters, order info. You can unsubscribe anytime.</li>
            </ul>

            <h2>Your Information & Our Promise</h2>
            <p>
              We use advanced security measures to protect your data from unauthorized access, alteration, or destruction.
            </p>

            <h2>Sharing Your Information</h2>
            <p>
              We <strong>never sell, trade, or rent</strong> your PII. We may share aggregated demographic data (not linked to PII) with trusted partners.
            </p>

            <h2>Modification</h2>
            <p>
              We may update this policy anytime. Check this page regularly. Continued use after changes means acceptance.
            </p>

            <h2>Your Acceptance</h2>
            <p>
              By using our site, you accept this Privacy Policy. If you disagree, please stop using the website.
            </p>

            <div className="border-t pt-6 mt-8">
              <h2>Contact Us</h2>
              <p>
                <strong>Phone:</strong> <a href="tel:+8801566395807" className="text-blue-600 hover:underline">+8801566395807</a><br />
                <strong>Email:</strong> <a href="mailto:khushbuwaala@gmail.com" className="text-blue-600 hover:underline">khushbuwaala@gmail.com</a><br />
                <strong>Hours:</strong> 10:00 AM – 10:00 PM (Daily)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}