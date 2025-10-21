"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { submitReview } from "@/app/actions/reviews"
import type { Review } from "@/lib/types"

interface ReviewSectionProps {
  productId: string
  reviews: Review[]
  userId?: string
}

export function ReviewSection({ productId, reviews, userId }: ReviewSectionProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const userHasReviewed = reviews.some((review) => review.user_id === userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      router.push("/auth/login")
      return
    }

    setIsSubmitting(true)
    try {
      await submitReview(productId, rating, comment)
      setRating(0)
      setComment("")
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">Reseñas</CardTitle>
        </CardHeader>
        <CardContent>
          {userId && !userHasReviewed && (
            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-lg text-amber-900 mb-4">Deja tu reseña</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-amber-900 mb-2 block">Calificación</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-amber-900 mb-2 block">Comentario (opcional)</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos tu experiencia..."
                    className="border-amber-200 focus:border-amber-400"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aún no hay reseñas para este producto. ¡Sé el primero en dejar una!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-amber-100 pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.user?.avatar_url || undefined} />
                      <AvatarFallback className="bg-amber-200 text-amber-900">
                        {review.user?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-amber-900">{review.user?.full_name || "Usuario"}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
