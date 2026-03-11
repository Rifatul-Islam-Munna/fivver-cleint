"use client"

import { History, Minus, PencilLine, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActivityLogEntry } from "@/lib/activity-log"

type Props = {
  entries: ActivityLogEntry[]
}

const actionMeta = {
  add: {
    label: "Added stock",
    icon: Plus,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  deduct: {
    label: "Deducted stock",
    icon: Minus,
    tone: "bg-rose-50 text-rose-700 border-rose-200",
  },
  update: {
    label: "Set stock",
    icon: PencilLine,
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export default function ActivityLogPanel({ entries }: Props) {
  return (
    <Card className="bg-white">
      <CardHeader className="gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f8f8] text-[#009a98]">
            <History className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
              Activity log
            </p>
            <CardTitle className="text-lg text-slate-900">
              See which user changed what
            </CardTitle>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Every stock action from this workspace is listed here.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {entries.length === 0 ? (
          <div className="px-5 py-6 text-sm leading-6 text-slate-600">
            No stock activity yet. When a user adds, deducts, or sets stock, the
            change will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const meta = actionMeta[entry.action]
              const Icon = meta.icon

              return (
                <div key={entry.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.tone}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-slate-900">{meta.label}</p>
                        <p className="text-xs text-slate-500">
                          {formatTime(entry.createdAt)}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-slate-700">
                        {entry.userName} changed <span className="font-medium">{entry.productName}</span>
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Qty: {entry.quantity} | Stock now: {entry.resultingStock}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.userIdentifier} | SKU {entry.sku}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
