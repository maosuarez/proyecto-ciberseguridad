"use server"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { Cart } from "@/lib/types"

export async function addToCart(productId: string, quantity: number) {
  const user = await requireAuth()

  // Validación de entrada para prevenir inyecciones
  if (!productId || typeof productId !== "string") {
    throw new Error("ID de producto inválido")
  }

  if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
    throw new Error("Cantidad inválida")
  }

  try {
    await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
      // Verificar que el producto existe y está disponible
      const product = await tx.product.findUnique({
        where: { id: productId },
      })

      if (!product || !product.available) {
        throw new Error("Producto no disponible")
      }

      // Obtener o crear carrito
      let cart: Cart | null = await tx.cart.findUnique({
        where: { user_id: user.id },
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: { user_id: user.id },
        })
      }

      // Verificar si el item ya existe en el carrito
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cart_id_product_id: {
            cart_id: cart.id,
            product_id: productId,
          },
        },
      })

      if (existingItem) {
        // Actualizar cantidad
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        })
      } else {
        // Crear nuevo item
        await tx.cartItem.create({
          data: {
            cart_id: cart.id,
            product_id: productId,
            quantity,
          },
        })
      }
    })

    revalidatePath("/")
    revalidatePath("/cart")
  } catch (error) {
    console.error("[v0] Error al agregar al carrito:", error)
    throw error
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const user = await requireAuth()

  // Validación de entrada
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("ID de item inválido")
  }

  if (quantity < 1 || !Number.isInteger(quantity)) {
    throw new Error("La cantidad debe ser al menos 1")
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    })

    if (!cartItem || cartItem.cart.user_id !== user.id) {
      throw new Error("Item no encontrado o no autorizado")
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })

    revalidatePath("/cart")
  } catch (error) {
    console.error("[v0] Error al actualizar cantidad:", error)
    throw error
  }
}

export async function removeCartItem(cartItemId: string) {
  const user = await requireAuth()

  // Validación de entrada
  if (!cartItemId || typeof cartItemId !== "string") {
    throw new Error("ID de item inválido")
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    })

    if (!cartItem || cartItem.cart.user_id !== user.id) {
      throw new Error("Item no encontrado o no autorizado")
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    revalidatePath("/cart")
  } catch (error) {
    console.error("[v0] Error al eliminar item:", error)
    throw error
  }
}

export async function clearCart() {
  const user = await requireAuth()

  try {
    const cart = await prisma.cart.findUnique({
      where: { user_id: user.id },
    })

    if (!cart) return

    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    })

    revalidatePath("/cart")
  } catch (error) {
    console.error("[v0] Error al limpiar carrito:", error)
    throw error
  }
}
