import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Verify HMAC signature header x-mock-signature
function verify(payload: string, sig: string | null, secret: string) {
  if (!sig) return false
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
}

export async function POST(req: NextRequest) {
  const text = await req.text()
  const sig = req.headers.get("x-mock-signature")
  const secret = process.env.MOCK_WEBHOOK_SECRET || ""

  if (!verify(text, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(text)
  // Process events: payment_intent.succeeded, payment_intent.payment_failed
  console.log("Mock webhook received event:", event.type)
  // aquí podés actualizar pedidos en DB, etc.

  return NextResponse.json({ received: true })
}
