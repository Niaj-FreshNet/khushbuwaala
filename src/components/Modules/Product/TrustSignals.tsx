import React from 'react';
import { Shield, Truck, RotateCcw, Award, Clock, HeartHandshake, CheckCircle, Star } from 'lucide-react';

export default function TrustSignals() {
  const trustSignals = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "100% Authentic",
      description: "Original quality guaranteed",
      color: "text-green-600 bg-green-50 border-green-200"
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Free Shipping",
      description: "On orders over ৳1000",
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      icon: <RotateCcw className="h-5 w-5" />,
      title: "7-Day Return",
      description: "Easy returns & refunds",
      color: "text-purple-600 bg-purple-50 border-purple-200"
    }
  ];

  const qualityBadges = [
    {
      icon: <Award className="h-4 w-4" />,
      text: "Premium Quality",
      description: "Tested & Certified"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      text: "Long Lasting",
      description: "8-12 Hours Duration"
    },
    {
      icon: <HeartHandshake className="h-4 w-4" />,
      text: "Customer Care",
      description: "24/7 Support"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Trust Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustSignals.map((signal, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${signal.color}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {signal.icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{signal.title}</div>
                <div className="text-xs opacity-80">{signal.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quality Badges */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          {qualityBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <div className="text-red-600 group-hover:scale-110 transition-transform duration-200">
                {badge.icon}
              </div>
              <div className="text-center">
                <div className="font-medium">{badge.text}</div>
                <div className="text-xs text-gray-500">{badge.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold">4.9/5</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">2,500+</span> Happy Customers
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Verified Reviews</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Secure Checkout</span>
          <div className="flex gap-1 ml-2">
            <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">V</div>
            <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">M</div>
          </div>
        </div>
      </div>
    </div>
  );
}