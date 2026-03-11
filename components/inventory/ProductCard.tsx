import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Product } from "@/app/page"

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const isLowStock = product.stock <= 5

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4 p-4">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          width={72}
          height={72}
          className="rounded-md border object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{product.name}</p>
          <p className="text-sm text-muted-foreground">ISBN: {product.isbn}</p>
          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          <div className="mt-1">
            <Badge variant={isLowStock ? "destructive" : "secondary"}>
              {isLowStock ? "⚠️ Low Stock" : "✅ In Stock"}: {product.stock}{" "}
              units
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
