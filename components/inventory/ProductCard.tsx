import { BookCopy } from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/inventory"

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const isLowStock = product.stock <= 5

  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={88}
            height={88}
            className="rounded-2xl border border-[#bfeeed] object-cover"
          />
        ) : (
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-[#bfeeed] bg-[#f4fbfb] text-[#009a98]">
            <BookCopy className="h-8 w-8" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
            Product
          </p>
          <p className="mt-1 truncate text-lg font-semibold text-slate-900">
            {product.name}
          </p>
          <p className="mt-2 text-sm text-slate-600">ISBN: {product.isbn}</p>
          <p className="text-sm text-slate-600">SKU: {product.sku}</p>
          <div className="mt-3">
            <Badge
              variant={isLowStock ? "destructive" : "secondary"}
              className="rounded-full px-3 py-1"
            >
              {isLowStock ? "Low stock" : "In stock"}: {product.stock} units
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
