"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FooterSection {
  id: string
  title: string
  underlineWidth: string
  links: Array<{
    label: string
    href: string
    icon?: React.ReactNode
    external?: boolean
    badge?: string
    description?: string
  }>
}

interface FooterCollapsibleProps {
  section: FooterSection
}

// Client Component - Only for mobile collapsible functionality
export default function FooterCollapsible({ section }: FooterCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-gray-200/70 last:border-b-0"
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between px-0 py-2 h-auto hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 group"
          aria-expanded={isOpen}
          aria-controls={`${section.id}-content`}
        >
          <div className="flex flex-col items-start">
            {/* ✅ reduced gap: mb-2 -> mb-1, title size a bit tighter on mobile */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-tight">
              {section.title}
            </h3>
            <div
              className={`h-0.5 ${section.underlineWidth} bg-gradient-to-r from-red-500 to-red-600 rounded-full`}
            />
          </div>

          {/* ✅ no rotate dependency on data-state; uses isOpen directly (safe) */}
          <span
            className={`ml-3 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden="true"
          >
            {isOpen ? (
              <Minus className="h-5 w-5 text-gray-500" />
            ) : (
              <Plus className="h-5 w-5 text-gray-500" />
            )}
          </span>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent
        id={`${section.id}-content`}
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2"
      >
        {/* ✅ reduced gap: mt-4 -> mt-2 */}
        <nav aria-label={`${section.title} navigation`} className="mt-2 pb-2">
          {/* ✅ reduced gap: space-y-4 -> space-y-2 */}
          <ul className="space-y-2">
            {section.links.map((link) => {
              const isMailOrTel =
                link.href.startsWith("mailto:") || link.href.startsWith("tel:")

              const commonClass =
                "flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-all duration-200"

              const content = (
                <>
                  {link.icon && (
                    <span className="text-red-500 group-hover:text-red-600 transition-colors">
                      {link.icon}
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                        {link.label}
                      </span>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                          {link.badge}
                        </Badge>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                    )}
                  </div>
                </>
              )

              return (
                <li key={link.href}>
                  <div className="group">
                    {link.external ? (
                      <a
                        href={link.href}
                        className={commonClass}
                        {...(isMailOrTel ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link href={link.href} className={commonClass}>
                        {content}
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}
