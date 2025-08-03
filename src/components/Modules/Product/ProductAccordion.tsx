"use client";
import React, { useState } from "react";
import { Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/Data/data";

interface ProductAccordionProps {
  product: Product;
}

const dummyReviews = [
  {
    name: "Aarif Rahman",
    rating: 5,
    comment: "Excellent longevity and the projection is outstanding. Loved it!",
  },
  {
    name: "Sara Haque",
    rating: 4,
    comment: "Very elegant scent. Could be a bit stronger on the base notes.",
  },
  {
    name: "Mahin Islam",
    rating: 5,
    comment: "Wore it at a wedding — received tons of compliments!",
  },
];

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const [active, setActive] = useState<string | null>("desc");
  const toggle = (panel: string) => setActive(active === panel ? null : panel);

  const reviews = dummyReviews;

  return (
    <div className="w-full max-w-2xl">
      {/* Description Panel */}
      <section className="mb-5">
        <Button
          onClick={() => toggle("desc")}
          aria-expanded={active === "desc"}
          className="w-full flex justify-between items-center py-4 px-5 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-50 to-pink-50 text-gray-900 border"
        >
          <span>Perfume Description</span>
          {active === "desc" ? <Minus /> : <Plus />}
        </Button>
        <AnimatePresence>
          {active === "desc" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "backOut" }}
              className="overflow-hidden px-4 pb-5 pt-3 bg-white shadow rounded-b-2xl"
            >
              <div className="text-gray-800 leading-snug whitespace-pre-line">
                {product.description}
              </div>
              {product.notes && (
                <div className="mt-4 font-medium text-gray-600">
                  Fragrance Notes:
                  <span className="font-normal ml-2">{product.notes}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {/* Reviews Panel */}
      <section>
        <Button
          onClick={() => toggle("reviews")}
          aria-expanded={active === "reviews"}
          className="w-full flex justify-between items-center py-4 px-5 rounded-xl font-semibold text-lg bg-gradient-to-r from-yellow-50 to-pink-50 text-gray-900 border"
        >
          <span>Customer Reviews ({reviews.length})</span>
          {active === "reviews" ? <Minus /> : <Plus />}
        </Button>
        <AnimatePresence>
          {active === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-4 pb-5 pt-3 bg-white shadow rounded-b-2xl"
            >
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((r, i) => (
                  <div
                    key={i}
                    className="mb-5 pb-2 border-b border-gray-100 last:border-0 last:mb-0"
                  >
                    <div className="flex gap-2 items-center font-semibold mb-1">
                      <span>{r.name}</span>
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} fill="currentColor" size={16} />
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-700">{r.comment}</div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
