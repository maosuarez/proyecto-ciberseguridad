"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { addToCart } from "@/app/actions/cart"

interface AddToCartButtonProps {
  productId: string
  userId?: string
}

export function AddToCartButton({ productId, userId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    try {
      await addToCart(productId, quantity)
      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-amber-900">Cantidad:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="border-amber-200 hover:bg-amber-50"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="border-amber-200 hover:bg-amber-50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isLoading ? "Agregando..." : "Agregar al Carrito"}
      </Button>
    </div>
  )
}
