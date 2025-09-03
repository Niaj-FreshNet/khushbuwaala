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
    id: string;
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
    <section className="space-y-8" aria-label="Product gallery">
      {/* Main Image Container */}
      <div className="relative group">
        {/* Enhanced Showcase Background */}
        <div 
          className="relative rounded-3xl p-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 shadow-2xl border border-blue-100/50 backdrop-blur-sm aspect-[4/5] min-h-[500px] flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => setLightbox(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          aria-label="Open product image lightbox"
          style={{ minHeight: 500 }}
        >
          {/* Refined Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/15 to-transparent rounded-full blur-3xl"></div>
          
          {/* Main Product Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[activeIdx]}
              alt={`${product.name} - Premium perfume bottle`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain transition-all duration-500 ${
                zoom ? 'scale-150' : 'scale-100'
              } ${isRotating ? 'animate-pulse' : ''} drop-shadow-2xl`}
              style={zoom ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : {}}
              priority
              loading="eager"
            />
          </div>

          {/* Enhanced Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg">
              {activeIdx + 1} / {images.length}
            </div>
          )}

          {/* Enhanced Control Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            {/* 360° Rotation Button */}
            {images.length > 1 && (
              <button
                className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
                  isRotating 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white border border-gray-200'
                }`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  toggleRotation(); 
                }}
                aria-label="Toggle 360° view"
                title="360° View"
              >
                <RotateCw size={20} className={isRotating ? 'animate-spin' : ''} />
              </button>
            )}
            
            {/* Zoom Button */}
            <button
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
                zoom 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border border-gray-200'
              }`}
              onClick={(e) => { 
                e.stopPropagation(); 
                setZoom(!zoom); 
              }}
              aria-label="Toggle zoom"
              title="Zoom In/Out"
            >
              <Search size={20} />
            </button>

            {/* Expand Button */}
            <button
              className="p-3 bg-white/90 text-gray-700 rounded-full hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-lg border border-gray-200"
              onClick={(e) => { 
                e.stopPropagation(); 
                setLightbox(true); 
              }}
              aria-label="Expand image"
              title="Full Screen"
            >
              <Maximize2 size={20} />
            </button>
          </div>

          {/* Enhanced Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Refined Decorative Elements */}
          <div className="absolute top-1/4 right-1/5 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
          
          {/* Enhanced Zoom Instruction */}
          {zoom && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Move mouse to zoom
            </div>
          )}
        </div>

        {/* Enhanced Premium Badge */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 border-2 border-white">
          <Sparkles size={14} />
          Premium Quality
        </div>
      </div>

      {/* Enhanced Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Views</h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {images.map((src, idx) => (
              <button
                key={idx}
                className={`relative flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 w-20 h-20 md:w-24 md:h-24 ${
                  activeIdx === idx
                    ? "border-blue-500 ring-4 ring-blue-200/50 scale-110 shadow-xl"
                    : "border-gray-300 hover:border-blue-400 hover:scale-105 hover:shadow-lg"
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
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                {activeIdx === idx && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg border-2 border-blue-500"></div>
                  </div>
                )}
                
                {/* Thumbnail index */}
                <div className="absolute bottom-1 right-1 bg-white/90 text-gray-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
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
