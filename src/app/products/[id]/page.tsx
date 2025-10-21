import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star } from "lucide-react"
import { formatPrice, calculateAverageRating } from "@/lib/utils/format"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ReviewSection } from "@/components/review-section"
import type { Review } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              full_name: true,
              avatar_url: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const averageRating = calculateAverageRating(product.reviews as unknown as Review[])

  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-amber-200">
            <Image
              src={product.image_url || "/placeholder.svg?height=600&width=600&query=delicious arepa"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-2">{product.name}</h1>
              {product.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-sm font-medium">
                  {product.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {averageRating > 0 ? averageRating.toFixed(1) : "Sin calificar"}
              </span>
              <span className="text-muted-foreground">
                ({product.reviews.length} {product.reviews.length === 1 ? "reseña" : "reseñas"})
              </span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-900">{formatPrice(Number(product.price_in_cents))}</span>
            </div>

            {product.available ? (
              <AddToCartButton productId={product.id} userId={user?.id} />
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Producto no disponible en este momento</p>
              </div>
            )}
          </div>
        </div>

        <ReviewSection productId={product.id} reviews={product.reviews as unknown as Review[]} userId={user?.id} />
      </main>
    </div>
  )
}
