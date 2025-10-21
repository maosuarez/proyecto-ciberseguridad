import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { CartItemCard } from "@/components/cart-item-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils/format"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Cart } from "@/lib/types"

export default async function CartPage() {
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

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product?.price_in_cents) * item.quantity
  }, 0)

  const tax = Math.round(subtotal * 0.19) // 19% IVA
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Mi Carrito</h1>

        {cartItems.length === 0 ? (
          <Card className="border-amber-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-amber-300 mb-4" />
              <h2 className="text-2xl font-semibold text-amber-900 mb-2">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-6">Agrega algunas deliciosas arepas para comenzar</p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/">Ver Productos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item as any} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="border-amber-200 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-900">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
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

                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6">
                    <Link href="/checkout">Proceder al Pago</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-amber-200 hover:bg-amber-50 bg-transparent"
                  >
                    <Link href="/">Continuar Comprando</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
