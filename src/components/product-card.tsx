import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  averageRating?: number
  reviewCount?: number
}

export function ProductCard({ product, averageRating = 0, reviewCount = 0 }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-amber-200 transition-all hover:shadow-lg hover:border-amber-400">
        <div className="relative aspect-square overflow-hidden bg-amber-50">
          <Image
            src={product.image_url || "/placeholder.svg?height=400&width=400&query=delicious arepa"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.category && (
            <Badge className="absolute top-2 right-2 bg-amber-600 hover:bg-amber-700">{product.category}</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-amber-900 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">
              {averageRating > 0 ? averageRating.toFixed(1) : "Sin calificar"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-2xl font-bold text-amber-900">{formatPrice(product.price_in_cents)}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
