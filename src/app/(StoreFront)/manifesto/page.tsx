import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Values | KhushbuWaala Perfumes Manifesto - Authenticity & Sustainability",
  description: "Discover KhushbuWaala Perfumes' core values: Authenticity, sustainability, and customer joy in every scent from our Dhaka roots.",
  openGraph: {
    title: "Manifesto - What KhushbuWaala Stands For",
    description: "Our promise: Real fragrances, real impact.",
    url: "https://www.khushbuwaala.com/manifesto",
  },
};

export default function ManifestoPage() {
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-amber-600" />,
      title: "Authenticity First",
      description: "Every bottle is 100% original, sourced ethically for true luxury.",
    },
    {
      icon: <Shield className="h-8 w-8 text-amber-600" />,
      title: "Customer Joy",
      description: "Personalized scent journeys that boost confidence and memories.",
    },
    {
      icon: <Leaf className="h-8 w-8 text-amber-600" />,
      title: "Sustainable Scents",
      description: "Eco-friendly packaging and support for local artisans in Bangladesh.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Manifesto</h1>
          <p className="text-xl text-gray-600">What we believe in: Scents that inspire, endure, and uplift.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardHeader className="text-center">
                <div className="mb-4">{value.icon}</div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}