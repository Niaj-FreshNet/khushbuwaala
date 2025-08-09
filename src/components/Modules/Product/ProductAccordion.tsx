"use client";
import React, { useState } from "react";
import { ChevronDown, Star, Shield, Award, Truck, CheckCircle, ThumbsUp, Calendar, Verified, Heart, MessageCircle, Info, Package, Sparkles, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/Data/data";

interface ProductAccordionProps {
  product: Product;
}

// Enhanced dummy reviews
const dummyReviews = [
  {
    id: 1,
    name: "Aarif Rahman",
    rating: 5,
    date: "2024-01-15",
    verified: true,
    comment: "Excellent longevity and the projection is outstanding. I've been using this for 3 months and it's become my signature scent. Perfect for office and evening events.",
    helpful: 12,
    pros: ["Long-lasting", "Great projection", "Professional scent"],
    cons: []
  },
  {
    id: 2,
    name: "Sara Haque",
    rating: 4,
    date: "2024-01-08",
    verified: true,
    comment: "Very elegant scent with beautiful floral notes. Could be a bit stronger on the base notes, but overall a wonderful fragrance. Fast delivery and authentic product.",
    helpful: 8,
    pros: ["Elegant scent", "Authentic quality", "Fast delivery"],
    cons: ["Could be stronger"]
  },
  {
    id: 3,
    name: "Mahin Islam",
    rating: 5,
    date: "2024-01-02",
    verified: true,
    comment: "Wore it at a wedding — received tons of compliments! The fragrance is sophisticated and unique. KhushbuWaala's service is excellent too.",
    helpful: 15,
    pros: ["Unique scent", "Gets compliments", "Excellent service"],
    cons: []
  }
];

interface AccordionItemProps {
  title: string; 
  children: React.ReactNode; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void;
  badge?: string;
  'data-section'?: string;
}

const AccordionItem = ({ 
  title, 
  children, 
  icon: Icon, 
  isOpen, 
  onToggle,
  badge,
  'data-section': dataSection
}: AccordionItemProps) => (
  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <button
      onClick={onToggle}
      data-section={dataSection}
      className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </div>
      <ChevronDown 
        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
          isOpen ? 'transform rotate-180' : ''
        }`} 
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="p-6 pt-0 bg-gray-50">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("description");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const avgRating = dummyReviews.reduce((acc, review) => acc + review.rating, 0) / dummyReviews.length;

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200">
        {[
          { id: 'description', label: 'Description', icon: Info },
          { id: 'details', label: 'Details', icon: Package },
          { id: 'reviews', label: 'Reviews', icon: Star },
          { id: 'shipping', label: 'Shipping', icon: Truck }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => toggleSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              openSection === section.id
                ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <AccordionItem
        title="Description & Notes"
        icon={Info}
        isOpen={openSection === "description"}
        onToggle={() => toggleSection("description")}
        data-section="description"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Product Description</h4>
            <p className="text-gray-700 leading-relaxed">
              {product.description || `Experience the luxury of ${product.name}, a premium ${
                product.specification === 'male' ? "men's" : "women's"
              } fragrance that embodies sophistication and elegance. This exquisite scent is perfect for those who appreciate fine fragrances and want to make a lasting impression.`}
            </p>
          </div>
          
          {product.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Fragrance Notes
              </h4>
              <div className="bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-gray-700">{product.notes}</p>
              </div>
            </div>
          )}

          {product.smell && product.smell.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fragrance Family</h4>
              <div className="flex flex-wrap gap-2">
                {product.smell.map((scent, index) => (
                  <Badge key={index} variant="outline" className="border-purple-200 text-purple-700">
                    {scent}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionItem>

      {/* Product Details */}
      <AccordionItem
        title="Product Details"
        icon={Package}
        isOpen={openSection === "details"}
        onToggle={() => toggleSection("details")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Specifications</h4>
            <div className="space-y-3">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">{product.brand}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Origin</span>
                  <span className="font-medium text-gray-900">{product.origin}</span>
                </div>
              )}
              {product.specification && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {product.specification === 'male' ? 'Men' : 'Women'}
                  </span>
                </div>
              )}
              {product.measurement && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Sizes</span>
                  <span className="font-medium text-gray-900">
                    {product.measurement === 'ml' ? '3ml, 6ml, 12ml, 25ml' : '3gm, 6gm, 12gm'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Longevity</span>
                <span className="font-medium text-gray-900">6-8 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Projection</span>
                <span className="font-medium text-gray-900">Moderate to Strong</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sillage</span>
                <span className="font-medium text-gray-900">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best For</span>
                <span className="font-medium text-gray-900">
                  {product.specification === 'male' ? 'Office, Evening' : 'Daily, Special Occasions'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AccordionItem>

      {/* Reviews */}
      <AccordionItem
        title="Customer Reviews"
        icon={Star}
        badge={`${dummyReviews.length} reviews`}
        isOpen={openSection === "reviews"}
        onToggle={() => toggleSection("reviews")}
      >
        <div className="space-y-6">
          {/* Enhanced Rating Summary */}
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-yellow-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-white">{avgRating.toFixed(1)}</span>
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < Math.floor(avgRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="text-gray-700 font-medium">Based on {dummyReviews.length} verified reviews</div>
              </div>
              
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = dummyReviews.filter(r => r.rating === rating).length;
                  const percentage = (count / dummyReviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-14">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex-1 bg-yellow-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {dummyReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-bold text-gray-900 text-lg">{review.name}</h5>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h6 className="text-sm font-semibold text-green-700 mb-2">Pros</h6>
                        <div className="space-y-1">
                          {review.pros.map((pro, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              {pro}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <h6 className="text-sm font-semibold text-red-700 mb-2">Cons</h6>
                        <div className="space-y-1">
                          {review.cons.map((con, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-red-600">
                              <span className="w-3 h-3 text-center">×</span>
                              {con}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionItem>

      {/* Shipping & Returns */}
      <AccordionItem
        title="Shipping & Returns"
        icon={Truck}
        isOpen={openSection === "shipping"}
        onToggle={() => toggleSection("shipping")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Shipping Information
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Inside Dhaka</h5>
                  <p className="text-sm text-gray-600">Free delivery within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Outside Dhaka</h5>
                  <p className="text-sm text-gray-600">৳60 delivery charge, 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Processing Time</h5>
                  <p className="text-sm text-gray-600">Orders processed within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Return Policy
            </h4>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">7-Day Return Policy</h5>
                <p className="text-sm text-green-700">
                  Return unused products within 7 days of delivery for a full refund
                </p>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Product must be unused and in original packaging
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Return shipping costs covered by customer
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Refund processed within 3-5 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
}