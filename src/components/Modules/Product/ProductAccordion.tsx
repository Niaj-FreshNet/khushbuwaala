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
import { cn } from "@/lib/utils";

interface ProductAccordionProps {
  product: Partial<IProduct>;
  initialOpenSection?: string;
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
  "data-section": dataSection,
}: AccordionItemProps) => (
  <div
    className={cn(
      "rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all",
      isOpen ? "shadow-sm" : "shadow-none"
    )}
  >
    <button
      type="button"
      onClick={onToggle}
      data-section={dataSection}
      className={cn(
        "w-full flex items-center justify-between text-left",
        // ✅ Tap target + compact padding
        "px-4 py-3 sm:px-5 sm:py-4",
        "hover:bg-gray-50 active:bg-gray-50 transition-colors"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {title}
            </h3>
            {badge && (
              <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <ChevronDown
        className={cn(
          "w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
          isOpen && "rotate-180"
        )}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0.5 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0.5 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {/* ✅ less padding + better mobile background */}
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 bg-gray-50">
            <div className="pt-3">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function ProductAccordion({ product, initialOpenSection }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string>(initialOpenSection ?? "");
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

  const openOnly = (section: string) => setOpenSection(section);
  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? "" : section));
  };

  // ✅ Show error toast if API fails
  useEffect(() => {
    if (isError && error) {
      toast(error?.data?.message || "Failed to load reviews");
    }
  }, [isError, error]);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   setOpenSection(window.innerWidth < 640 ? "" : "description");
  // }, []);

  useEffect(() => {
    const handler = () => openOnly("description");
    window.addEventListener("kw:open-description", handler);
    return () => window.removeEventListener("kw:open-description", handler);
  }, []);

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
    <div className="space-y-2 sm:space-y-3">
      {/* Section Navigation */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-2">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: "description", label: "Description", icon: Info },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "shipping", label: "Shipping", icon: Truck },
          ].map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => toggleSection(section.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all",
                "border",
                openSection === section.id
                  ? "bg-white text-gray-900 border-gray-200 shadow-sm"
                  : "bg-transparent text-gray-600 border-transparent hover:bg-white hover:border-gray-200"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>
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
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">
                  Product Description
                </h4>
                {/* <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Read the story of this perfume
                </p> */}
              </div>

              <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                Premium
              </Badge>
            </div>

            {/* accent bar */}
            <div className="mt-3 sm:mt-4 flex gap-3">
              <div className="w-1.5 rounded-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />

              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[15px] sm:text-base leading-7 text-gray-800",
                    "font-medium tracking-[0.01em]"
                  )}
                  style={{ textWrap: "pretty" as any }}
                >
                  {product.description ||
                    `Experience the luxury of ${product.name}, a premium ${product.gender === "male" ? "men's" : "women's"
                    } fragrance that embodies sophistication and elegance. This exquisite scent is perfect for those who appreciate fine fragrances and want to make a lasting impression.`}
                </p>

                {/* subtle callout line */}
                <p className="mt-3 text-xs sm:text-sm text-gray-600">
                  {/* ✨ Tip: Apply on pulse points for best performance. */}
                  <p>Note: Each bottle is beautifully captured, though shades may vary slightly under different lighting.</p>
                </p>
              </div>
            </div>

            {/* optional quick highlights (auto, no extra fields needed) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(product.longevity || "6-8 hours") && (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold mr-1">Longevity:</span> {product.longevity?.replace(/[_-]+/g, " ") || "6-8 hours"}
                </span>
              )}
              {(product.projection || "Moderate to Strong") && (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold mr-1">Projection:</span> {product.projection?.replace(/[_-]+/g, " ") || "Moderate to Strong"}
                </span>
              )}
              {(product.sillage || "Good") && (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold mr-1">Sillage:</span> {product.sillage?.replace(/[_-]+/g, " ") || "Good"}
                </span>
              )}
              {(product.bestFor || "Good") && (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold mr-1">Best For:</span> {product.bestFor?.join(", ") || "Day, Office, Evening"}
                </span>
              )}
            </div>
          </div>

          {product.perfumeNotes && typeof product.perfumeNotes === "object" && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Perfume Notes
              </h4>
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="space-y-1">
                  {Object.entries(product.perfumeNotes).map(([title, note]) => {
                    const formattedTitle =
                      title.charAt(0).toUpperCase() + title.slice(1);

                    return (
                      <p key={title} className="text-gray-800 text-[15px] sm:text-base leading-7">
                        <span className="font-bold text-gray-900">{formattedTitle}:</span>{" "}
                        <span className="text-gray-700">{Array.isArray(note) ? note.join(", ") : note}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {product.accords && product.accords.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Fragrance Family</h4>
              <div className="flex flex-wrap gap-2">
                {product.accords.map((scent, index) => (
                  <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 text-md sm:text-base">
                    {scent}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Specs + Performance (moved here) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Specifications */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>

              <div className="space-y-2 text-sm">
                {product.brand && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium text-gray-900 text-right break-words">
                      {/* {product.brand} */}
                      KhushbuWaala
                    </span>
                  </div>
                )}

                {product.origin && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-600">Origin</span>
                    <span className="font-medium text-gray-900 text-right break-words">
                      {product.origin}
                    </span>
                  </div>
                )}

                {product.gender && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-medium text-gray-900 text-right capitalize">
                      {product.gender === "male" ? "Men" : "Women"}
                    </span>
                  </div>
                )}

                {(product.variants || []).length > 0 && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-600">Available Sizes</span>

                    <div className="text-right space-y-1">
                      {/* sizes */}
                      <span className="font-medium text-gray-900 break-words block">
                        {product.variants!.map((v) => `${v.size} ${v.unit?.toLowerCase()}`).join(", ")}
                      </span>

                      {/* wholesale note */}
                      <span className="text-[11px] sm:text-xs text-emerald-600 font-medium">
                        Wholesale from 100ML+
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Longevity</span>
                  <span className="font-medium text-gray-900 text-right break-words">
                    {product.longevity?.replace(/[_-]+/g, " ") || "6-8 hours"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Projection</span>
                  <span className="font-medium text-gray-900 text-right break-words">
                    {product.projection?.replace(/[_-]+/g, " ") || "Moderate to Strong"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Sillage</span>
                  <span className="font-medium text-gray-900 text-right break-words">
                    {product.sillage?.replace(/[_-]+/g, " ") || "Good"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Best For</span>
                  <span className="font-medium text-gray-900 text-right break-words">
                    {product.bestFor?.join(", ") ||
                      (product.gender === "male"
                        ? "Office, Evening"
                        : "Daily, Special Occasions")}
                  </span>
                </div>
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
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-yellow-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(avgRating) ? "text-yellow-500 fill-current" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 font-medium mt-1">
                    {reviews.length} reviews
                  </div>
                  <div className="text-[12px] text-gray-600">
                    Verified customer ratings
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-xs font-medium">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex-1 bg-yellow-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-6 text-right font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="rating">Your Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer ${i < newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
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
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
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
                  <h5 className="font-medium text-gray-900 break-words text-right sm:text-left">Inside Dhaka</h5>
                  <p className="text-sm text-gray-600">৳50 delivery charge, 1-2 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 break-words text-right sm:text-left">Outside Dhaka</h5>
                  <p className="text-sm text-gray-600">৳120 delivery charge, 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 break-words text-right sm:text-left">Processing Time</h5>
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
              <div className="bg-green-50 rounded-xl p-3.5 sm:p-4 border border-green-200">
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