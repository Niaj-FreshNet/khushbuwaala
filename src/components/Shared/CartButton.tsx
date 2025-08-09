"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartOperations } from "@/lib/store/hooks/useCartOperations"
import type { Product } from "@/lib/Data/data"

interface CartButtonProps {
  product: Product
  selectedSize: string
  className?: string
  showQuantity?: boolean
}

export default function CartButton({ 
  product, 
  selectedSize, 
  className = "",
  showQuantity = false 
}: CartButtonProps) {
  const { 
    isInCart, 
    getItemQuantity, 
    addItemToCart, 
    incrementQuantity, 
    decrementQuantity,
    removeItemFromCart 
  } = useCartOperations()
  
  const [isAdding, setIsAdding] = useState(false)
  const inCart = isInCart(product._id, selectedSize)
  const quantity = getItemQuantity(product._id, selectedSize)

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItemToCart(product, 1, selectedSize)
    
    // Show feedback animation
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleIncrement = () => {
    incrementQuantity(product._id, selectedSize)
  }

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItemFromCart(product._id, selectedSize)
    } else {
      decrementQuantity(product._id, selectedSize)
    }
  }

  if (inCart && showQuantity) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleDecrement}
          className="h-8 w-8"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="min-w-[2ch] text-center font-semibold">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleIncrement}
          className="h-8 w-8"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  if (inCart) {
    return (
      <Button
        variant="secondary"
        className={`${className}`}
        disabled
      >
        <Check className="w-4 h-4 mr-2" />
        Added to Cart
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`${className}`}
      variant="default"
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
