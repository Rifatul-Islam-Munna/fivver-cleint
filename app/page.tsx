"use client"

import { useState } from "react"
import ISBNInput from "@/components/inventory/ISBNInput"
import Scanner from "@/components/inventory/Scanner"
import ProductCard from "@/components/inventory/ProductCard"
import StockActions from "@/components/inventory/StockActions"
import LoadingSkeleton from "@/components/inventory/LoadingSkeleton"
import { sileo } from "sileo"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScanLine, Keyboard } from "lucide-react"

export type Product = {
  id: string
  name: string
  isbn: string
  image: string
  stock: number
  sku: string
}

export default function InventoryPage() {
  const [mode, setMode] = useState<"scan" | "input">("input")
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  const handleISBN = async (isbn: string) => {
    if (!isbn.trim()) return
    setProduct(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/product?isbn=${isbn}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Product not found")
      setProduct(data)
    } catch (err: any) {
      sileo.error({ title: "Not Found", description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          📦 Inventory Manager
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scan or enter an ISBN to manage stock
        </p>
      </div>

      {/* Mode Toggle */}
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "scan" | "input")}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="input">
            <Keyboard className="mr-2 h-4 w-4" /> Enter ISBN
          </TabsTrigger>
          <TabsTrigger value="scan">
            <ScanLine className="mr-2 h-4 w-4" /> Scan QR
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Input or Scanner */}
      <div className="w-full max-w-md">
        {mode === "input" ? (
          <ISBNInput onSubmit={handleISBN} loading={loading} />
        ) : (
          <Scanner onScan={handleISBN} />
        )}
      </div>

      {/* Result */}
      <div className="mt-6 w-full max-w-md">
        {loading && <LoadingSkeleton />}
        {product && !loading && (
          <>
            <ProductCard product={product} />
            <StockActions product={product} setProduct={setProduct} />
          </>
        )}
      </div>
    </main>
  )
}
