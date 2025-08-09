"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartOperations } from "@/lib/store/hooks/useCartOperations"
import Link from "next/link"

interface CartBadgeProps {
  className?: string
  showText?: boolean
}

export default function CartBadge({ className = "", showText = false }: CartBadgeProps) {
  const { itemsCount, subtotal } = useCartOperations()

  return (
    <Button asChild variant="ghost" className={`relative ${className}`}>
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {showText && <span className="ml-2">Cart</span>}
        
        {itemsCount > 0 && (
          <>
            {/* Cart count badge */}
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
            >
              {itemsCount > 99 ? '99+' : itemsCount}
            </Badge>
            
            {/* Cart total (optional, for desktop) */}
            {showText && (
              <span className="ml-2 text-sm font-semibold text-green-600">
                ৳{subtotal.toFixed(0)}
              </span>
            )}
          </>
        )}
      </Link>
    </Button>
  )
}
