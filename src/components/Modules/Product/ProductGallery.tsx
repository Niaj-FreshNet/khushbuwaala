"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, RotateCw, Sparkles, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface ProductGalleryProps {
  product: {
    name: string;
    primaryImage: string;
    secondaryImage?: string;
    moreImages?: string[];
    _id: string;
  };
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = [
    product.primaryImage,
    ...(product.secondaryImage ? [product.secondaryImage] : []),
    ...(product.moreImages || [])
  ].filter(Boolean);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Auto-rotate simulation for 360° effect
  useEffect(() => {
    if (!isRotating || images.length < 2) return;
    
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isRotating, images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const nextImage = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
    if (images.length < 2) {
      // Simulate rotation with single image by adding visual effects
      setActiveIdx(0);
    }
  };

  return (
    <section className="space-y-6" aria-label="Product gallery">
      {/* Main Image Container */}
      <div className="relative group">
        {/* Perfume Showcase Background */}
        <div 
          className="relative rounded-3xl p-4 bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 shadow-2xl border border-pink-100/50 backdrop-blur-sm aspect-[4/5] min-h-[420px] flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setLightbox(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          aria-label="Open product image lightbox"
          style={{ minHeight: 420 }}
        >
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/10 via-transparent to-amber-200/10 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-pink-300/20 to-transparent rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-radial from-amber-300/20 to-transparent rounded-full blur-xl"></div>
          
          {/* Main Product Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[activeIdx]}
              alt={`${product.name} - Premium perfume bottle`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain transition-all duration-500 ${
                zoom ? 'scale-150' : 'scale-100'
              } ${isRotating ? 'animate-pulse' : ''}`}
              style={zoom ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : {}}
              priority
              loading="eager"
            />
          </div>

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {activeIdx + 1} / {images.length}
            </div>
          )}

          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* 360° Rotation Button */}
            {images.length > 1 && (
              <button
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  isRotating 
                    ? 'bg-pink-600 text-white shadow-lg' 
                    : 'bg-black/60 text-white hover:bg-pink-600/80'
                }`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleRotation(); 
                }}
                aria-label="Toggle 360° view"
                title="360° View"
              >
                <RotateCw size={18} className={isRotating ? 'animate-spin' : ''} />
              </button>
            )}
            
            {/* Zoom Button */}
            <button
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                zoom 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-black/60 text-white hover:bg-blue-600/80'
              }`}
              onClick={(e) => { 
                e.stopPropagation(); 
                setZoom(!zoom); 
              }}
              aria-label="Toggle zoom"
              title="Zoom In/Out"
            >
              <Search size={18} />
            </button>

            {/* Expand Button */}
            <button
              className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                setLightbox(true); 
              }}
              aria-label="Expand image"
              title="Full Screen"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* Navigation Arrows for Mobile */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all lg:opacity-0 lg:group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Sparkle Effects */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
          
          {/* Zoom Instruction */}
          {zoom && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
              Move mouse to zoom
            </div>
          )}
        </div>

        {/* Premium Badge */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Sparkles size={12} />
          Premium Quality
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((src, idx) => (
            <button
              key={idx}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden border-3 transition-all duration-300 w-20 h-20 ${
                activeIdx === idx
                  ? "border-pink-500 ring-4 ring-pink-300/50 scale-110 shadow-lg"
                  : "border-gray-200 hover:border-pink-300 hover:scale-105"
              }`}
              onClick={() => {
                setActiveIdx(idx);
                setIsRotating(false);
              }}
              aria-label={`Show image ${idx + 1}`}
              type="button"
            >
              <Image
                src={src}
                alt={`${product.name} thumbnail ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              {activeIdx === idx && (
                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <DialogTitle className="sr-only">
            {product.name} - Full size image {activeIdx + 1} of {images.length}
          </DialogTitle>
          
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
            onClick={() => setLightbox(false)}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {activeIdx + 1} / {images.length}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                disabled={activeIdx === 0}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                disabled={activeIdx === images.length - 1}
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main Lightbox Image */}
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={images[activeIdx]}
              alt={`${product.name} - Full size view`}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>

          {/* Thumbnail Navigation in Lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-sm overflow-x-auto">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeIdx === idx ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
