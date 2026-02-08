"use client";

import { useEffect } from "react";

export default function StickyCartObserver() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    const setup = () => {
      const actionButtons = document.getElementById("action-buttons");
      const stickyCart = document.getElementById("sticky-cart");

      // If not ready yet, try again next frame
      if (!actionButtons || !stickyCart) {
        rafId = requestAnimationFrame(setup);
        return;
      }

      const hideSticky = () => {
        stickyCart.style.transform = "translateY(100%)";
        stickyCart.style.pointerEvents = "none";
      };

      const showSticky = () => {
        stickyCart.style.transform = "translateY(0)";
        stickyCart.style.pointerEvents = "auto";
      };

      observer = new IntersectionObserver(
        ([entry]) => {
          // if main action buttons are visible -> hide sticky
          if (entry.isIntersecting) hideSticky();
          else showSticky();
        },
        {
          // hide a bit earlier when action buttons are near bottom
          root: null,
          threshold: 0.01,
          rootMargin: "0px 0px -120px 0px",
        }
      );

      observer.observe(actionButtons);
    };

    setup();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}
