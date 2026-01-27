// src/components/ProductAccordion.tsx

"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Star, Shield, Award, Truck, CheckCircle, Calendar, Verified, Sparkles, Clock, Globe, Info, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { IProduct, IReview } from "@/types/product.types";
import { useGetProductReviewsQuery, useCreateReviewMutation } from "@/redux/store/api/review/reviewApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/redux/store/hooks/useAuth";
import { toast } from "sonner";

interface ProductAccordionProps {
  product: Partial<IProduct>;
}

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
  'data-section': dataSection,
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
        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
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
  const [openSection, setOpenSection] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const { user, isAuthenticated } = useAuth();

  // ✅ Fetch reviews
  const {
    data,
    isLoading: loadingReviews,
    isError,
    error,
    refetch,
  } = useGetProductReviewsQuery(product?.id, {
    skip: !product?.id,
  });

  const reviews = Array.isArray(data?.data) ? data.data : [];

  // ✅ Mutation for creating a new review
  const [createReview] = useCreateReviewMutation();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // ✅ Show error toast if API fails
  useEffect(() => {
    if (isError && error) {
      toast(error?.data?.message || "Failed to load reviews");
    }
  }, [isError, error]);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Handle review form submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast("Please log in to submit a review.");
      return;
    }
    if (newReview.rating < 1 || newReview.rating > 5) {
      toast("Rating must be between 1 and 5.",);
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast("Title and comment are required.");
    }
    setSubmitting(true);
    try {
      await createReview({
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        productId: product.id!,
        userId: user?.id,
      }).unwrap();

      setNewReview({ rating: 0, title: "", comment: "" });
      toast("Your review has been submitted and is pending approval.");

      await refetch(); // ✅ Refresh reviews list
    } catch (err: any) {
      toast(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="space-y-3">
      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200">
        {[
          { id: 'description', label: 'Description', icon: Info },
          { id: 'details', label: 'Details', icon: Package },
          { id: 'reviews', label: 'Reviews', icon: Star },
          { id: 'shipping', label: 'Shipping', icon: Truck },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => toggleSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${openSection === section.id
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
              {product.description ||
                `Experience the luxury of ${product.name}, a premium ${product.gender === 'male' ? "men's" : "women's"
                } fragrance that embodies sophistication and elegance. This exquisite scent is perfect for those who appreciate fine fragrances and want to make a lasting impression.`}
            </p>
          </div>

          {product.perfumeNotes && typeof product.perfumeNotes === "object" && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Fragrance Notes
              </h4>
              <div className="bg-white rounded-xl p-4 border border-purple-100">
                <div className="space-y-1">
                  {Object.entries(product.perfumeNotes).map(([title, note]) => (
                    <p key={title} className="text-gray-700">
                      <span className="font-semibold">{title}:</span> {Array.isArray(note) ? note.join(", ") : note}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {product.accords && product.accords.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fragrance Family</h4>
              <div className="flex flex-wrap gap-2">
                {product.accords.map((scent, index) => (
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
              {product.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {product.gender === 'male' ? 'Men' : 'Women'}
                  </span>
                </div>
              )}
              {(product.variants || []).length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Sizes</span>
                  <span className="font-medium text-gray-900">
                    {product.variants!.map((v) => `${v.size}${v.unit}`).join(", ")}
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
                <span className="font-medium text-gray-900">{product.longevity || "6-8 hours"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Projection</span>
                <span className="font-medium text-gray-900">{product.projection || "Moderate to Strong"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sillage</span>
                <span className="font-medium text-gray-900">{product.sillage || "Good"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best For</span>
                <span className="font-medium text-gray-900">
                  {product.bestFor?.join(", ") || (product.gender === 'male' ? 'Office, Evening' : 'Daily, Special Occasions')}
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
        badge={`${reviews.length} reviews`}
        isOpen={openSection === "reviews"}
        onToggle={() => toggleSection("reviews")}
      >
        <div className="space-y-6">
          {/* Rating Summary */}
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
                <div className="text-gray-700 font-medium">Based on {reviews.length} verified reviews</div>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
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

          {/* Review Submission Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="rating">Your Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 cursor-pointer ${i < newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      onClick={() => handleRatingSelect(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Enter a title for your review"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product"
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>

          {/* Individual Reviews */}
          {loadingReviews ? (
            <div className="text-center text-gray-600">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-600">No reviews yet. Be the first to review this product!</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-bold text-gray-900 text-lg">{review.user.name}</h5>
                          {review.isPublished && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                            >
                              <Verified className="w-3 h-3 mr-1" />
                              Verified Review
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
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
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