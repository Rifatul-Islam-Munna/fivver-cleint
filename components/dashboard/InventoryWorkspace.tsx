"use client"

import { useState } from "react"
import { Keyboard, LogOut, ScanLine } from "lucide-react"

import ActivityLogPanel from "@/components/dashboard/ActivityLogPanel"
import ISBNInput from "@/components/inventory/ISBNInput"
import LoadingSkeleton from "@/components/inventory/LoadingSkeleton"
import ProductCard from "@/components/inventory/ProductCard"
import Scanner from "@/components/inventory/Scanner"
import StockActions from "@/components/inventory/StockActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getActivityLog } from "@/lib/activity-log"
import type { AuthSession } from "@/lib/demo-auth"
import type { Product } from "@/lib/inventory"
import { sileo } from "sileo"

type Props = {
  session: AuthSession
  onLogout: () => void
}

export default function InventoryWorkspace({ session, onLogout }: Props) {
  const [mode, setMode] = useState<"scan" | "input">("input")
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [entries, setEntries] = useState(() => getActivityLog())

  const refreshActivityLog = () => {
    setEntries(getActivityLog())
  }

  const handleISBN = async (isbn: string) => {
    if (!isbn.trim()) return

    setProduct(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/product?isbn=${isbn}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Product not found")
      }

      setProduct(data)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to find that product"

      sileo.error({ title: "Lookup failed", description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <Card id="stock-workspace" className="bg-white">
          <CardHeader className="gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
                  Stock workspace
                </p>
                <CardTitle className="text-lg text-slate-900 sm:text-xl">
                  Find a product and update quantity
                </CardTitle>
                <p className="text-sm leading-6 text-slate-600">
                  Search or scan an ISBN, then save the change to the activity log.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">{session.fullName}</p>
                  <p className="text-xs text-slate-500">{session.businessName}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="h-10 w-full justify-center rounded-xl border-slate-200 bg-white px-4 text-center text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "scan" | "input")}
              className="w-full gap-0"
            >
              <TabsList
                variant="line"
                className="grid h-auto w-full grid-cols-2 gap-0 border-b border-slate-100 p-0"
              >
                <TabsTrigger
                  value="input"
                  className="h-12 rounded-none border-0 px-2 pb-3 pt-2 text-center text-sm text-slate-500 after:bottom-[-1px] after:h-[2px] after:bg-[#009a98] data-active:bg-[#f7fcfc] data-active:text-[#009a98] sm:px-4"
                >
                  <Keyboard className="mr-2 h-4 w-4 shrink-0" />
                  Enter ISBN
                </TabsTrigger>
                <TabsTrigger
                  value="scan"
                  className="h-12 rounded-none border-0 px-2 pb-3 pt-2 text-center text-sm text-slate-500 after:bottom-[-1px] after:h-[2px] after:bg-[#009a98] data-active:bg-[#f7fcfc] data-active:text-[#009a98] sm:px-4"
                >
                  <ScanLine className="mr-2 h-4 w-4 shrink-0" />
                  Scan code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="rounded-2xl border border-[#dceeed] bg-[#f7fcfc] p-4 sm:p-5">
              {mode === "input" ? (
                <ISBNInput onSubmit={handleISBN} loading={loading} />
              ) : (
                <Scanner onScan={handleISBN} />
              )}
            </div>

            {loading && <LoadingSkeleton />}

            {!loading && product && (
              <div className="space-y-3">
                <ProductCard product={product} />
                <StockActions
                  product={product}
                  setProduct={setProduct}
                  onActionComplete={refreshActivityLog}
                />
              </div>
            )}

            {!loading && !product && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Enter ISBN or scan a code
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Load the product first, then update the quantity below it.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Every change is saved in the log
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      You can always see which user added, deducted, or updated a product.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ActivityLogPanel entries={entries} />
    </section>
  )
}
