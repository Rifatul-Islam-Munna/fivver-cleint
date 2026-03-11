"use client"

import Link from "next/link"
import { LockKeyhole, Mail, ScanBarcode, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { DEMO_ACCOUNT, getAuthSession, loginUser } from "@/lib/demo-auth"
import { setPendingToast } from "@/lib/pending-toast"

const homeNotes = [
  {
    title: "Clear stock flow",
    description: "Search a product, update stock, and save the action fast.",
  },
  {
    title: "User action log",
    description: "See which user added, deducted, or set the stock.",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    identifier: DEMO_ACCOUNT.emailOrUsername,
    password: DEMO_ACCOUNT.password,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const activeSession = getAuthSession()

      if (activeSession) {
        router.replace("/dashboard")
        return
      }

      setReady(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 900))

    const result = loginUser(form.identifier, form.password)

    if ("error" in result) {
      setError(result.error ?? "Login failed. Check your credentials.")
      setLoading(false)
      return
    }

    setPendingToast({
      title: "Login successful",
      description: "Welcome back to the stock workspace.",
    })
    router.push("/dashboard")
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Spinner className="size-4 text-[#009a98]" />
            Preparing login...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="rounded-3xl bg-[#f4fbfb] p-5 sm:p-6">
          <div className="space-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#009a98]">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
              Shopline
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold text-slate-950 sm:text-4xl">
              Login to your stock workspace
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Search products, update quantity, and review user activity from one
              clear mobile-friendly workspace.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Search by ISBN
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Scan on mobile
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Track user updates
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-3xl bg-white p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
                Secure access
              </p>
              <h2 className="text-2xl font-semibold text-slate-950">Login</h2>
              <p className="text-sm leading-6 text-slate-600">
                Use email or username and password to open the stock workspace.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Email / Username
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={form.identifier}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        identifier: event.target.value,
                      }))
                      setError(null)
                    }}
                    autoComplete="username"
                    placeholder="admin@shopline.app"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Password
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                      setError(null)
                    }}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full justify-center rounded-xl bg-[#00cec8] text-center text-slate-950 hover:bg-[#00b8b3]"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-4 rounded-2xl bg-[#f4fbfb] px-4 py-3 text-sm leading-6 text-slate-700">
              Demo account is prefilled. Click login to open the dashboard.
            </div>

            <p className="mt-4 text-sm text-slate-600">
              Need a new workspace?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#009a98] hover:text-[#00b8b3]"
              >
                Create an account
              </Link>
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {homeNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-3xl bg-white p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f8f8] text-[#009a98]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {note.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {note.description}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
