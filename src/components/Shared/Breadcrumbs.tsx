"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Script from "next/script";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Structured data for SEO
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
      <Script
        id="breadcrumb-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        strategy="afterInteractive"
      />

      <nav
        aria-label="Breadcrumb navigation"
        className={cn(
          // ✅ Key: prevent any horizontal overflow
          "w-full max-w-full overflow-x-hidden",
          // ✅ keep spacing small on mobile
          "py-3",
          className
        )}
      >
        {/* ✅ min-w-0 allows truncation inside flex */}
        <ol
          className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1",
            "text-sm text-gray-600",
            "min-w-0"
          )}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const isCurrent = !!item.current;

            return (
              <li
                key={`${item.href}-${index}`}
                className={cn(
                  // ✅ allow shrinking
                  "flex items-center min-w-0",
                  // ✅ last item should take remaining space and truncate
                  isLast && "flex-1"
                )}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />

                {isFirst ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 hover:text-pink-600 transition-colors"
                    itemProp="item"
                  >
                    <Home className="h-4 w-4 flex-shrink-0" />
                    <span itemProp="name" className="font-medium">
                      {item.name}
                    </span>
                  </Link>
                ) : isCurrent ? (
                  // ✅ Current page: MUST truncate on mobile
                  <span
                    className={cn(
                      "font-medium text-gray-900",
                      "min-w-0 max-w-full truncate"
                    )}
                    itemProp="name"
                    aria-current="page"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "hover:text-pink-600 transition-colors",
                      // ✅ non-current items: truncate a bit on small screens
                      "min-w-0 max-w-[180px] sm:max-w-none truncate"
                    )}
                    itemProp="item"
                    title={item.name}
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}

                {/* Separator */}
                {!isLast && (
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
