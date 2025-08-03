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
export default function FooterCollapsible ({ section }: FooterCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto hover:bg-transparent group"
          aria-expanded={isOpen}
          aria-controls={`${section.id}-content`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
              <div className={`h-0.5 ${section.underlineWidth} bg-gradient-to-r from-red-500 to-red-600 rounded-full`} />
            </div>
            <div className="transition-transform duration-300 group-data-[state=open]:rotate-180">
              {isOpen ? <Minus className="h-5 w-5 text-gray-500" /> : <Plus className="h-5 w-5 text-gray-500" />}
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent
        id={`${section.id}-content`}
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2"
      >
        <nav aria-label={`${section.title} navigation`} className="mt-4">
          <ul className="space-y-4">
            {section.links.map((link) => (
              <li key={link.href}>
                <div className="group">
                  {link.external ? (
                    <a
                      href={link.href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      {...(link.href.startsWith("mailto:") || link.href.startsWith("tel:")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {link.icon && (
                        <span className="text-red-500 group-hover:text-red-600 transition-colors">{link.icon}</span>
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
                        {link.description && <p className="text-xs text-gray-500 mt-1">{link.description}</p>}
                      </div>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      {link.icon && (
                        <span className="text-red-500 group-hover:text-red-600 transition-colors">{link.icon}</span>
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
                        {link.description && <p className="text-xs text-gray-500 mt-1">{link.description}</p>}
                      </div>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}
