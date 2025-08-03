"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCw, Share2, Heart, X } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const mainImageRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);

  // Preload images for better UX
  useEffect(() => {
    images.forEach((src, index) => {
      const img = new window.Image();
      img.onload = () => {
        setIsLoading(prev => ({ ...prev, [index]: false }));
      };
      img.onerror = () => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
        setIsLoading(prev => ({ ...prev, [index]: false }));
      };
      setIsLoading(prev => ({ ...prev, [index]: true }));
      img.src = src;
    });
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          setLightboxOpen(false);
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const goToNext = useCallback(() => {
    setActiveIdx(prev => (prev + 1) % images.length);
    resetZoom();
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setActiveIdx(prev => (prev - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length]);

  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      const newLevel = Math.max(prev - 0.5, 1);
      if (newLevel === 1) setIsZoomed(false);
      return newLevel;
    });
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isZoomed) {
      zoomIn();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      if (zoomImageRef.current) {
        zoomImageRef.current.style.transformOrigin = `${x}% ${y}%`;
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    setTouchStart(null);
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing perfume: ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className="space-y-6" aria-label="Product image gallery">
      {/* Main Image Display */}
      <div 
        ref={mainImageRef}
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Main product image, click to open gallery"
      >
        {/* Loading State */}
        {isLoading[activeIdx] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {imageErrors[activeIdx] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <div>Image not available</div>
            </div>
          </div>
        )}

        {/* Main Image */}
        {!isLoading[activeIdx] && !imageErrors[activeIdx] && (
          <Image
            src={images[activeIdx]}
            alt={`${product.name} - view ${activeIdx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-700 group-hover:scale-105"
            priority={activeIdx === 0}
            quality={90}
          />
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Top Controls */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 hover:bg-white border-0 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                shareProduct();
              }}
              aria-label="Share product"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 hover:bg-white border-0 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              aria-label="Open lightbox"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {activeIdx + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((src, idx) => (
            <button
              key={idx}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                activeIdx === idx
                  ? "border-red-600 ring-2 ring-red-600/30 scale-105 shadow-lg"
                  : "border-gray-200 hover:border-red-300 hover:scale-102"
              )}
              onClick={() => {
                setActiveIdx(idx);
                resetZoom();
              }}
              aria-label={`View image ${idx + 1}`}
              type="button"
            >
              {/* Loading state for thumbnails */}
              {isLoading[idx] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              
              {!isLoading[idx] && !imageErrors[idx] && (
                <Image
                  src={src}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              )}
              
              {/* Active indicator */}
              {activeIdx === idx && (
                <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/95 backdrop-blur-sm" />
        <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Lightbox Controls */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setRotation(prev => prev + 90)}
                aria-label="Rotate image"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation in Lightbox */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
                  onClick={goToPrevious}
                  disabled={activeIdx === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-40"
                  onClick={goToNext}
                  disabled={activeIdx === images.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Lightbox Image */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <Image
                ref={zoomImageRef}
                src={images[activeIdx]}
                alt={`${product.name} - detailed view ${activeIdx + 1}`}
                width={800}
                height={800}
                className={cn(
                  "max-w-full max-h-full object-contain transition-all duration-300 cursor-zoom-in",
                  isZoomed && "cursor-zoom-out"
                )}
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
                onClick={handleImageClick}
                priority
              />
            </div>

            {/* Lightbox Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                {activeIdx + 1} of {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
