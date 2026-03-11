"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { sileo } from "sileo"

import InventoryWorkspace from "@/components/dashboard/InventoryWorkspace"
import { Spinner } from "@/components/ui/spinner"
import {
  clearAuthSession,
  getAuthSession,
  type AuthSession,
} from "@/lib/demo-auth"
import { popPendingToast } from "@/lib/pending-toast"

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const activeSession = getAuthSession()

      if (!activeSession) {
        router.replace("/")
        return
      }

      setSession(activeSession)
      setReady(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [router])

  useEffect(() => {
    if (!ready) return

    const pendingToast = popPendingToast()

    if (!pendingToast) return

    sileo.success(pendingToast)
  }, [ready])

  const handleLogout = () => {
    clearAuthSession()
    router.replace("/")
  }

  if (!ready || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Spinner className="size-4 text-[#009a98]" />
            Loading workspace...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <InventoryWorkspace session={session} onLogout={handleLogout} />
      </div>
    </main>
  )
}
