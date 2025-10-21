import { NextRequest, NextResponse } from "next/server"
import { createIntent } from "@/lib/mockPaymentsStorage"

const ALLOWED_CURRENCIES = ["usd", "eur", "cop"]

export async function POST(req: NextRequest) {
  // Auth: simple secret header
  const auth = req.headers.get("x-mock-payments-secret")
  if (auth !== process.env.MOCK_PAYMENTS_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const idempotencyKey = req.headers.get("idempotency-key") || undefined

  const body = await req.json().catch(() => ({}))
  const amount = Number(body.amount)
  const currency = String(body.currency || "usd").toLowerCase()
  const metadata = (body.metadata && typeof body.metadata === "object") ? body.metadata : {}

  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }
  if (!ALLOWED_CURRENCIES.includes(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
  }

  const intent = await createIntent({ amount, currency, metadata, idempotencyKey })
  return NextResponse.json({ id: intent.id, client_secret: intent.client_secret, status: intent.status })
}
