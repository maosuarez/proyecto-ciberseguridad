"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart"
import type { CartItem } from "@/lib/types"

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  if (!item.product) return null

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      await updateCartItemQuantity(item.id, newQuantity)
      router.refresh()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeCartItem(item.id)
      router.refresh()
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const itemTotal = item.product.price_in_cents * item.quantity

  return (
    <Card className="border-amber-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
            <Image
              src={item.product.image_url || "/placeholder.svg?height=96&width=96&query=arepa"}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg text-amber-900">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{item.product.description}</p>
              <p className="text-lg font-bold text-amber-900 mt-1">{formatPrice(item.product.price_in_cents)}</p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-amber-200 hover:bg-amber-50 bg-transparent"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-amber-200 hover:bg-amber-50 bg-transparent"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-amber-900">{formatPrice(itemTotal)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemove}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {!item.product.available && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            Este producto ya no está disponible
          </div>
        )}
      </CardContent>
    </Card>
  )
}
