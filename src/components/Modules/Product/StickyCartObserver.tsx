"use client";
import { useEffect } from 'react';

export default function StickyCartObserver() {
  useEffect(() => {
    const actionButtons = document.getElementById('action-buttons');
    const stickyCart = document.getElementById('sticky-cart');
    
    if (actionButtons && stickyCart) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Main buttons are visible, hide sticky cart
            stickyCart.style.transform = 'translateY(100%)';
          } else {
            // Main buttons are not visible, show sticky cart
            stickyCart.style.transform = 'translateY(0)';
          }
        });
      }, {
        rootMargin: '0px 0px -50px 0px'
      });
      
      observer.observe(actionButtons);
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null;
}