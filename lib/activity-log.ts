import { getAuthSession } from "@/lib/demo-auth"
import type { Product } from "@/lib/inventory"

export type StockAction = "add" | "deduct" | "update"

export type ActivityLogEntry = {
  id: string
  action: StockAction
  quantity: number
  resultingStock: number
  createdAt: string
  productId: string
  productName: string
  isbn: string
  sku: string
  userName: string
  userIdentifier: string
}

const ACTIVITY_LOG_KEY = "shopline.stock-activity"

function hasWindow() {
  return typeof window !== "undefined"
}

function readEntries() {
  if (!hasWindow()) return [] as ActivityLogEntry[]

  try {
    const value = window.localStorage.getItem(ACTIVITY_LOG_KEY)

    if (!value) return []

    return JSON.parse(value) as ActivityLogEntry[]
  } catch {
    return []
  }
}

function writeEntries(entries: ActivityLogEntry[]) {
  if (!hasWindow()) return

  window.localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(entries))
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `activity_${Date.now()}`
}

export function getActivityLog() {
  return readEntries()
}

export function appendActivityLog(input: {
  action: StockAction
  quantity: number
  resultingStock: number
  product: Product
}) {
  const session = getAuthSession()

  const entry: ActivityLogEntry = {
    id: createId(),
    action: input.action,
    quantity: input.quantity,
    resultingStock: input.resultingStock,
    createdAt: new Date().toISOString(),
    productId: input.product.id,
    productName: input.product.name,
    isbn: input.product.isbn,
    sku: input.product.sku,
    userName: session?.fullName ?? "Unknown user",
    userIdentifier: session?.emailOrUsername ?? "unknown",
  }

  const nextEntries = [entry, ...readEntries()].slice(0, 50)
  writeEntries(nextEntries)

  return entry
}
