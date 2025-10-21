import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/format"
import Image from "next/image"
import { Cart } from "@/lib/types"

export default async function CheckoutPage() {
  const user = await requireAuth()

  const cart: Cart | null = await prisma.cart.findUnique({
    where: { user_id: user.id },
    include: {
      cart_items: {
        include: {
          product: true,
        },
      },
    },
  })

  const cartItems = cart?.cart_items || []

  if (cartItems.length === 0) {
    redirect("/cart")
  }

  // Check if all products are available
  const unavailableItems = cartItems.filter((item) => !item.product?.available)
  if (unavailableItems.length > 0) {
    redirect("/cart")
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product?.price_in_cents) * item.quantity
  }, 0)

  const tax = Math.round(subtotal * 0.19)
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-amber-100 last:border-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                      <Image
                        src={item.product?.image_url || "/placeholder.svg?height=64&width=64&query=arepa"}
                        alt={item.product?.name || "Texto Alt"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-900">{item.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium text-amber-900">
                        {formatPrice(Number(item.product?.price_in_cents) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA (19%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-amber-900">Total</span>
                      <span className="text-2xl font-bold text-amber-900">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-900">Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm totalAmount={total} cartId={cart?.id || ""} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
