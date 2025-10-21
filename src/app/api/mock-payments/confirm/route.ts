import { NextRequest, NextResponse } from "next/server"
import { getIntent, updateIntent } from "@/lib/mockPaymentsStorage"
import { randomUUID } from "crypto"
import crypto from "crypto"

function signWebhook(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-mock-payments-secret")
  if (auth !== process.env.MOCK_PAYMENTS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const id = String(body.id || "")
  const paymentMethod = body.payment_method || null

  const intent = await getIntent(id)
  if (!intent) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Simulate processing (we can add more robust rules: reject if card number ends with 0000, etc.)
  const newStatus = Math.random() < 0.95 ? "succeeded" : "failed" // 95% success for tests
  const updated = await updateIntent(id, { status: newStatus as any })

  // Fire local webhook to your app endpoint if configured (simulate stripe)
  if (process.env.MOCK_WEBHOOK_TARGET) {
    const event = {
      type: newStatus === "succeeded" ? "payment_intent.succeeded" : "payment_intent.payment_failed",
      data: { object: updated },
      id: `evt_${randomUUID()}`,
      created: Math.floor(Date.now() / 1000)
    }
    const payload = JSON.stringify(event)
    const sig = signWebhook(payload, process.env.MOCK_WEBHOOK_SECRET || "secret")
    // fire async, don't block response
    fetch(process.env.MOCK_WEBHOOK_TARGET, {
      method: "POST",
      headers: { "content-type": "application/json", "x-mock-signature": sig },
      body: payload,
    }).catch(console.error)
  }

  return NextResponse.json({ id: updated?.id, status: updated?.status })
}
