"use client"

import { useState, useCallback } from "react"
import { createCheckoutSession } from "@/app/actions/payments"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils/format"
import { redirect } from "next/navigation"
import { CheckoutButton } from "./checkout-button"

interface CheckoutFormProps {
  totalAmount: number
  cartId: string
}

export function CheckoutForm({ totalAmount, cartId }: CheckoutFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [press, setPress] = useState<boolean>(false)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await createCheckoutSession(totalAmount, cartId)
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la sesión de pago")
      throw err
    }
  }, [totalAmount, cartId])

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div id="checkout" className="flex justify-center items-center">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre en la tarjeta</Label>
          <Input id="name" placeholder="Juan Perez" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card">Número de tarjeta</Label>
          <Input id="card" placeholder="4242 4242 4242 4242" maxLength={19} />
        </div>

        <div className="flex space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="exp">Expira</Label>
            <Input id="exp" placeholder="12/28" maxLength={5} />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" maxLength={3} type="password" />
          </div>
        </div>

        <div className="my-4 h-px bg-gray-200" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total:</p>
          <p className="text-lg font-semibold">{formatPrice(totalAmount)}</p>
        </div>

        <CheckoutButton totalAmount={totalAmount} cartId={cartId} />
      </div>
    </div>
  )

}
