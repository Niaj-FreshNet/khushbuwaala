import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Script from 'next/script';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://khushbuwaala.com${item.href}`,
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="breadcrumb-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        strategy="afterInteractive"
      />
      
      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb navigation"
        className="flex items-center space-x-2 text-sm text-gray-600 mb-6 px-4 sm:px-6 lg:px-8"
      >
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li 
              key={item.href} 
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />
              
              {index === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-pink-600 transition-colors duration-200"
                  itemProp="item"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : item.current ? (
                <span 
                  className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-pink-600 transition-colors duration-200 truncate max-w-[150px] sm:max-w-none"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              
              {index < items.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}