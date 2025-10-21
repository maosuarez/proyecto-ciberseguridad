"use server"

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-utils"
import crypto from "crypto"
import { redirect } from "next/navigation"
import type { Cart } from "@/lib/types"

// 🔒 Simulador seguro de pasarela de pago local
async function simulatePayment(totalAmount: number, metadata: Record<string, any>) {
  if (totalAmount <= 0 || !Number.isFinite(totalAmount)) {
    throw new Error("Monto inválido")
  }

  // Tiempo simulado de procesamiento
  await new Promise((r) => setTimeout(r, 1500))

  return {
    id: crypto.randomUUID(),
    client_secret: crypto.randomBytes(16).toString("hex"),
    amount: totalAmount,
    status: "succeeded",
    metadata,
  }
}

export async function createCheckoutSession(totalAmount: number, cartId: string) {
  const user = await requireAuth()

  if (!cartId || typeof cartId !== "string") throw new Error("ID de carrito inválido")
  if (!totalAmount || totalAmount <= 0) throw new Error("Monto inválido")

  try {
    const cart: Cart | null = await prisma.cart.findUnique({
      where: { id: cartId, user_id: user.id },
      include: { cart_items: { include: { product: true } } },
    })

    if (!cart || !cart.cart_items?.length) throw new Error("Carrito vacío")

    const unavailableItems = cart.cart_items.filter((item) => !item.product?.available)
    if (unavailableItems.length > 0) throw new Error("Algunos productos ya no están disponibles")

    // 🧾 Crear orden y sus ítems
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newOrder = await tx.order.create({
        data: {
          user_id: user.id,
          total_amount_in_cents: totalAmount / 100,
          status: "pending",
        },
      })

      await tx.orderItem.createMany({
        data:
          cart.cart_items?.map((item) => ({
            product_name: item.product?.name || "Indefinido",
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product_price_in_cents: item.product?.price_in_cents ?? 0,
          })) ?? [],
      })

      return newOrder
    })

    // 💳 Simular pago exitoso
    const session = await simulatePayment(totalAmount, {
      order_id: order.id,
      user_id: user.id,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripe_payment_intent_id: session.id,
        status: session.status === "succeeded" ? "completed" : "failed",
      },
    })

    // ✅ Devolver info al cliente
    return {
      client_secret: session.client_secret,
      order_id: order.id,
      status: session.status,
    }
  } catch (error) {
    console.error("[mock-payments] Error al crear sesión de pago:", error)
    throw error
  }
}

export async function completeOrder(orderId: string) {
  const user = await requireAuth()
  if (!orderId || typeof orderId !== "string") throw new Error("ID de orden inválido")

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findUnique({
        where: { id: orderId, user_id: user.id },
      })
      if (!order) throw new Error("Orden no encontrada")

      await tx.order.update({
        where: { id: orderId },
        data: { status: "completed" },
      })

      const cart = await tx.cart.findUnique({ where: { user_id: user.id } })
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cart_id: cart.id } })
      }
    })

    redirect("/orders")
  } catch (error) {
    console.error("[mock-payments] Error al completar orden:", error)
    throw error
  }
}
