import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const DB_FILE = path.join(process.cwd(), "data", "mock_payments.json")

export type PaymentIntentStatus = "requires_payment_method" | "processing" | "succeeded" | "failed"
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  client_secret: string
  status: PaymentIntentStatus
  metadata?: Record<string,string>
  created_at: string
  updated_at: string
  idempotencyKey?: string | null
}

async function ensureDb() {
  const dir = path.dirname(DB_FILE)
  await fs.mkdir(dir, { recursive: true })
  try {
    await fs.access(DB_FILE)
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ intents: [] }, null, 2))
  }
}

export async function readAll() {
  await ensureDb()
  const raw = await fs.readFile(DB_FILE, "utf8")
  return JSON.parse(raw)
}

export async function writeAll(obj: any) {
  await ensureDb()
  await fs.writeFile(DB_FILE, JSON.stringify(obj, null, 2))
}

export async function createIntent(data: {
  amount: number
  currency: string
  metadata?: Record<string,string>
  idempotencyKey?: string | null
}) : Promise<PaymentIntent> {
  const db = await readAll()
  // idempotency: return existing if same key
  if (data.idempotencyKey) {
    const found = db.intents.find((i: PaymentIntent) => i.idempotencyKey === data.idempotencyKey)
    if (found) return found
  }

  const intent: PaymentIntent = {
    id: `pi_${randomUUID()}`,
    amount: data.amount,
    currency: data.currency,
    client_secret: `cs_${randomUUID()}`,
    status: "requires_payment_method",
    metadata: data.metadata || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    idempotencyKey: data.idempotencyKey || null,
  }
  db.intents.push(intent)
  await writeAll(db)
  return intent
}

export async function updateIntent(id: string, patch: Partial<PaymentIntent>) {
  const db = await readAll()
  const idx = db.intents.findIndex((i: PaymentIntent) => i.id === id)
  if (idx === -1) return null
  db.intents[idx] = { ...db.intents[idx], ...patch, updated_at: new Date().toISOString() }
  await writeAll(db)
  return db.intents[idx]
}

export async function getIntent(id: string) {
  const db = await readAll()
  return db.intents.find((i: PaymentIntent) => i.id === id) || null
}
