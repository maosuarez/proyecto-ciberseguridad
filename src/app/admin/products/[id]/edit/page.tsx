import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/product-form"
import type { Product } from "@/lib/types"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  await requireAuth()

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-900">Editar Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm product={product as unknown as Product} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
