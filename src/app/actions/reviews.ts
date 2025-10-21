"use server"

import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { Product } from "@/lib/types"
import sanitizeHtml from "sanitize-html"

export async function submitReview(productId: string, rating: number, comment: string) {
  const user = await requireAuth()

  const cleanComment = sanitizeHtml(comment, {
    allowedTags: [], // No permitas etiquetas HTML
    allowedAttributes: {},
  })

  // Validación de entrada para prevenir inyecciones
  if (!productId || typeof productId !== "string") {
    throw new Error("ID de producto inválido")
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("La calificación debe estar entre 1 y 5")
  }

  if (cleanComment && typeof cleanComment !== "string") {
    throw new Error("Comentario inválido")
  }

  try {
    // Verificar que el producto existe
    const product: Product | null = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error("Producto no encontrado")
    }

    await prisma.review.upsert({
      where: {
        product_id_user_id: {
          product_id: productId,
          user_id: user.id,
        },
      },
      update: {
        rating,
        comment: cleanComment,
      },
      create: {
        product_id:productId,
        user_id: user.id,
        rating,
        comment: cleanComment,
      },
    })

    revalidatePath(`/products/${productId}`)
  } catch (error) {
    console.error("[v0] Error al enviar review:", error)
    throw error
  }
}
