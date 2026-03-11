"use client"

import { useState } from "react"
import { Minus, Plus, RefreshCw } from "lucide-react"
import { sileo } from "sileo"

import { appendActivityLog, type StockAction } from "@/lib/activity-log"
import type { Product } from "@/lib/inventory"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Props = {
  product: Product
  setProduct: (p: Product) => void
  onActionComplete?: () => void
}

export default function StockActions({
  product,
  setProduct,
  onActionComplete,
}: Props) {
  const [quantity, setQuantity] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: StockAction) => {
    const qty = parseInt(quantity)

    if (!qty || qty <= 0) {
      sileo.warning({
        title: "Invalid quantity",
        description: "Enter a valid number",
      })
      return
    }

    if (action === "deduct" && qty > product.stock) {
      sileo.error({
        title: "Insufficient stock",
        description: `Only ${product.stock} units are available.`,
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action, quantity: qty }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      const updatedProduct = { ...product, stock: data.newStock }
      setProduct(updatedProduct)
      setQuantity("")

      appendActivityLog({
        action,
        quantity: qty,
        resultingStock: data.newStock,
        product: updatedProduct,
      })
      onActionComplete?.()

      sileo.success({
        title: "Stock updated",
        description: `New stock: ${data.newStock} units`,
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to update stock"

      sileo.error({ title: "Update failed", description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">
            Update quantity
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            Enter a quantity, then choose the action.
          </p>
        </div>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Quantity
          <Input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={1}
            className="h-12 rounded-xl border-slate-200 bg-white px-4"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            onClick={() => handleAction("add")}
            disabled={loading}
            className="h-11 w-full justify-center rounded-xl bg-[#00cec8] px-4 text-center text-slate-950 hover:bg-[#00b8b3]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>

          <Button
            onClick={() => handleAction("deduct")}
            disabled={loading}
            variant="outline"
            className="h-11 w-full justify-center rounded-xl border-rose-100 bg-rose-50 px-4 text-center text-rose-700 hover:bg-rose-100"
          >
            <Minus className="mr-2 h-4 w-4" />
            Deduct
          </Button>

          <Button
            onClick={() => handleAction("update")}
            disabled={loading}
            variant="outline"
            className="h-11 w-full justify-center rounded-xl border-slate-200 bg-slate-50 px-4 text-center text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
