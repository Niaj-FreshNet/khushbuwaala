"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";

interface ProductGalleryProps {
  product: {
    name: string;
    primaryImage: string;
    moreImages?: string[];
  };
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = [product.primaryImage, ...(product.moreImages || [])];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl p-2 bg-gradient-to-br from-white via-neutral-50 to-red-50 shadow-2xl relative group aspect-[4/5] min-h-[420px] flex items-center justify-center cursor-pointer"
        onClick={() => setLightbox(true)}
        aria-label="Open product image lightbox"
        style={{minHeight: 420}}
      >
        <Image
          src={images[activeIdx]}
          alt={`${product.name} image`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-transform duration-200 group-hover:scale-105"
          priority
        />
        <button
          className="absolute top-3 right-3 p-2 bg-black/80 text-white rounded-full opacity-70 hover:opacity-100"
          onClick={e => { e.stopPropagation(); setLightbox(true); }}
          aria-label="Expand image"
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <div className="flex gap-2">
        {images.map((src, idx) => (
          <button
            key={idx}
            className={`rounded-lg overflow-hidden border-2 ring-2 transition-all duration-200 w-16 h-16 ${
              activeIdx === idx
                ? "border-red-600 ring-red-400 scale-110"
                : "border-transparent ring-transparent hover:ring-red-300"
            }`}
            onClick={() => setActiveIdx(idx)}
            aria-label={`Show image ${idx + 1}`}
            type="button"
          >
            <Image
              src={src}
              alt={`${product.name} thumbnail ${idx + 1}`}
              width={70}
              height={70}
              className="object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      {/* Lightbox Dialog */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-3xl bg-black/95 p-0 flex justify-center items-center">
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white z-10"
            disabled={activeIdx === 0}
            onClick={() => setActiveIdx((v) => Math.max(0, v - 1))}
            aria-label="Previous image"
            type="button"
          >
            <ChevronLeft size={30} />
          </button>
          <Image
            src={images[activeIdx]}
            alt={product.name}
            width={650}
            height={650}
            className="rounded-2xl max-h-[90vh] object-contain"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white z-10"
            disabled={activeIdx === images.length - 1}
            onClick={() => setActiveIdx((v) => Math.min(images.length - 1, v + 1))}
            aria-label="Next image"
            type="button"
          >
            <ChevronRight size={30} />
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
