"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { sileo } from "sileo"
import { Plus, Minus, RefreshCw } from "lucide-react"
import type { Product } from "@/app/page"

type Props = {
  product: Product
  setProduct: (p: Product) => void
}

type Action = "add" | "deduct" | "update"

export default function StockActions({ product, setProduct }: Props) {
  const [quantity, setQuantity] = useState("")
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: Action) => {
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
        title: "Insufficient Stock",
        description: `Only ${product.stock} units available`,
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, action, quantity: qty }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setProduct({ ...product, stock: data.newStock })
      setQuantity("")
      setActiveAction(null)
      sileo.success({
        title: "Stock Updated",
        description: `New stock: ${data.newStock} units`,
      })
    } catch (err: any) {
      sileo.error({ title: "Update Failed", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Input
          type="number"
          placeholder="Enter quantity..."
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1}
        />
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleAction("add")}
            disabled={loading}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
          <Button
            onClick={() => handleAction("deduct")}
            disabled={loading}
            variant="destructive"
          >
            <Minus className="mr-1 h-4 w-4" /> Deduct
          </Button>
          <Button
            onClick={() => handleAction("update")}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className="mr-1 h-4 w-4" /> Set
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
