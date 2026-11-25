import React from "react";
import {
  Phone,
  MessageSquare,
} from "lucide-react";

const TrustSignals = () => {
  return (
    <div className="space-y-6 sm:space-y-8">


      {/* Contact Section */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">
            Need Help Choosing?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Tell us what you like — we’ll recommend the perfect scent for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+8801777152588"
              className="inline-flex items-center justify-center px-6 py-1.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>

            <a
              href="https://wa.me/8801777152588"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-1.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
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
