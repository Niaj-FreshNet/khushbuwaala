"use client";
import React, { useState } from "react";
import { Plus, Minus, Star, MessageCircle, Shield, Award, Truck, CheckCircle, ThumbsUp, Calendar, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/Data/data";

interface ProductAccordionProps {
  product: Product;
}

// Enhanced dummy reviews with more realistic data
const dummyReviews = [
  {
    id: 1,
    name: "Aarif Rahman",
    rating: 5,
    date: "2024-01-15",
    verified: true,
    comment: "Excellent longevity and the projection is outstanding. I've been using this for 3 months and it's become my signature scent. Perfect for office and evening events.",
    helpful: 12,
    images: [],
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
    images: [],
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
    images: [],
    pros: ["Unique scent", "Gets compliments", "Excellent service"],
    cons: []
  },
  {
    id: 4,
    name: "Fatima Ahmed",
    rating: 5,
    date: "2023-12-28",
    verified: true,
    comment: "Perfect for daily wear. Not too overpowering but still noticeable. The bottle quality is premium and the scent lasts all day.",
    helpful: 6,
    images: [],
    pros: ["Perfect for daily wear", "Premium quality", "All-day lasting"],
    cons: []
  }
];

// Trust signals and guarantees
const trustSignals = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Only genuine fragrances from authorized distributors",
    color: "text-green-600"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "2-3 days delivery across Bangladesh",
    color: "text-blue-600"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Carefully curated and quality tested",
    color: "text-purple-600"
  },
  {
    icon: CheckCircle,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
    color: "text-indigo-600"
  }
];

// Review component
const ReviewCard = ({ review }: { review: typeof dummyReviews[0] }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [markedHelpful, setMarkedHelpful] = useState(false);

  const handleHelpful = () => {
    if (!markedHelpful) {
      setHelpful(helpful + 1);
      setMarkedHelpful(true);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              {review.verified && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <Verified size={12} />
                  Verified
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${
                      i < review.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString('en-BD', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Pros and Cons */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.pros.length > 0 && (
            <div>
              <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle size={16} />
                Pros
              </h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons.length > 0 && (
            <div>
              <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                <Minus size={16} />
                Cons
              </h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
            markedHelpful 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp size={14} />
          Helpful ({helpful})
        </button>
        <div className="text-xs text-gray-500">
          Was this review helpful?
        </div>
      </div>
    </div>
  );
};

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const [active, setActive] = useState<string | null>("desc");
  const toggle = (panel: string) => setActive(active === panel ? null : panel);

  const reviews = dummyReviews;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Description Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Button
          onClick={() => toggle("desc")}
          aria-expanded={active === "desc"}
          className="w-full flex justify-between items-center py-6 px-6 font-semibold text-lg bg-gradient-to-r from-pink-50 to-purple-50 text-gray-900 border-0 hover:from-pink-100 hover:to-purple-100 rounded-none"
        >
          <span className="flex items-center gap-3">
            <MessageCircle size={20} />
            Fragrance Description & Details
          </span>
          {active === "desc" ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <AnimatePresence>
          {active === "desc" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                {/* Product Description */}
                <div className="prose max-w-none">
                  <div className="text-gray-800 leading-relaxed mb-6 text-base">
                    {product.description}
                  </div>
                  
                  {/* Fragrance Notes */}
                  {product.notes && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
                      <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <Star className="text-indigo-600" size={18} />
                        Fragrance Notes
                      </h3>
                      <p className="text-indigo-800 leading-relaxed">{product.notes}</p>
                    </div>
                  )}

                  {/* Product Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 mb-3">Product Details</h4>
                      {product.brand && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Brand</span>
                          <span className="font-medium text-gray-900">{product.brand}</span>
                        </div>
                      )}
                      {product.origin && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Origin</span>
                          <span className="font-medium text-gray-900">{product.origin}</span>
                        </div>
                      )}
                      {product.specification && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Gender</span>
                          <span className="font-medium text-gray-900 capitalize">{product.specification}</span>
                        </div>
                      )}
                      {product.measurement && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Available Sizes</span>
                          <span className="font-medium text-gray-900">
                            {product.measurement === 'ml' ? '3ml, 6ml, 12ml, 25ml' : '3gm, 6gm, 12gm'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 mb-3">Fragrance Profile</h4>
                      {product.smell && product.smell.length > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Family</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {product.smell.map((scent, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                              >
                                {scent}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Longevity</span>
                        <span className="font-medium text-gray-900">6-8 hours</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Projection</span>
                        <span className="font-medium text-gray-900">Moderate to Strong</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Best For</span>
                        <span className="font-medium text-gray-900">All Occasions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reviews Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Button
          onClick={() => toggle("reviews")}
          aria-expanded={active === "reviews"}
          className="w-full flex justify-between items-center py-6 px-6 font-semibold text-lg bg-gradient-to-r from-yellow-50 to-orange-50 text-gray-900 border-0 hover:from-yellow-100 hover:to-orange-100 rounded-none"
        >
          <span className="flex items-center gap-3">
            <Star size={20} />
            Customer Reviews ({reviews.length})
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{averageRating.toFixed(1)}</span>
            </div>
          </span>
          {active === "reviews" ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <AnimatePresence>
          {active === "reviews" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                {/* Reviews Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 mb-6 border border-yellow-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={20} 
                            className={`${
                              i < Math.floor(averageRating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {reviews.length} reviews</p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating, index) => (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-12">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="text-sm">{rating}</span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(ratingDistribution[index] / reviews.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {ratingDistribution[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No reviews yet</p>
                    <p>Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust & Guarantee Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Button
          onClick={() => toggle("trust")}
          aria-expanded={active === "trust"}
          className="w-full flex justify-between items-center py-6 px-6 font-semibold text-lg bg-gradient-to-r from-green-50 to-blue-50 text-gray-900 border-0 hover:from-green-100 hover:to-blue-100 rounded-none"
        >
          <span className="flex items-center gap-3">
            <Shield size={20} />
            Trust & Guarantee
          </span>
          {active === "trust" ? <Minus size={20} /> : <Plus size={20} />}
        </Button>
        <AnimatePresence>
          {active === "trust" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trustSignals.map((signal, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`p-3 rounded-full bg-white shadow-sm ${signal.color}`}>
                        <signal.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{signal.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Trust Content */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Award size={20} />
                    Our Promise to You
                  </h4>
                  <div className="space-y-3 text-blue-800">
                    <p className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                      <span>All products are 100% authentic and sourced directly from authorized distributors</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                      <span>Fast and secure delivery with tracking information provided</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                      <span>7-day return policy - no questions asked if you're not satisfied</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                      <span>Customer support available 6 days a week to help with any concerns</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
