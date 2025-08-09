import React from 'react';
import { Shield, Truck, RotateCcw, Award, Clock, Star, CheckCircle, Phone, MessageSquare } from 'lucide-react';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Genuine products only",
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "2-3 days in Dhaka",
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "7-day return policy",
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Long-lasting fragrances",
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Always here to help",
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200"
    },
    {
      icon: CheckCircle,
      title: "Secure Payment",
      description: "Safe & secure checkout",
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    }
  ];

  const customerStats = [
    {
      number: "50,000+",
      label: "Happy Customers",
      icon: Star,
      color: "text-yellow-600"
    },
    {
      number: "15,000+",
      label: "Products Sold",
      icon: Award,
      color: "text-purple-600"
    },
    {
      number: "4.8/5",
      label: "Customer Rating",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      number: "99%",
      label: "Satisfaction Rate",
      icon: MessageSquare,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {trustFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border rounded-2xl p-3 sm:p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 touch-manipulation`}
            >
              <div className="flex justify-center mb-2 sm:mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-full flex items-center justify-center shadow-sm`}>
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor}`} />
                </div>
              </div>
              <h3 className={`font-bold text-gray-900 text-xs sm:text-sm mb-1`}>
                {feature.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed hidden sm:block">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Customer Statistics */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Trusted by Thousands
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join our community of satisfied customers who trust KhushbuWaala for authentic, premium fragrances
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {customerStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 mb-4">
            Our fragrance experts are here to help you find the perfect scent
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+8801566395807"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </a>
            <a
              href="https://wa.me/8801566395807"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;