import { prisma } from "@/lib/db"
import {Prisma} from "@prisma/client"
import { requireAuth } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { redirect } from "next/navigation"

interface SuccessPageProps {
  searchParams: Promise<{ order_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.order_id

  if (!orderId) {
    redirect("/")
  }

  const user = await requireAuth()

  try {
    await prisma.$transaction(async (tx:  Prisma.TransactionClient) => {
      // Verificar que la orden pertenece al usuario
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
          user_id: user.id, // Filtro de seguridad
        },
      })

      if (!order) {
        throw new Error("Orden no encontrada")
      }

      // Update order status to completed
      await tx.order.update({
        where: { id: orderId },
        data: { status: "completed" },
      })

      // Clear cart
      const cart = await tx.cart.findUnique({
        where: { user_id: user.id },
      })

      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cart_id: cart.id },
        })
      }
    })
  } catch (error) {
    console.error("[v0] Error al completar orden:", error)
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-amber-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-amber-900">¡Pago Exitoso!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación en breve.
              </p>

              <div className="space-y-3">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                  <Link href="/orders">Ver Mis Pedidos</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-amber-200 hover:bg-amber-50 bg-transparent">
                  <Link href="/">Continuar Comprando</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
