import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-amber-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-3xl text-amber-900">Pago Cancelado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Tu pago ha sido cancelado. No se realizó ningún cargo a tu cuenta.
              </p>

              <div className="space-y-3">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                  <Link href="/cart">Volver al Carrito</Link>
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
