"use client"

import Link from "next/link"
import { Building2, LockKeyhole, Mail, ScanBarcode, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getAuthSession, registerUser } from "@/lib/demo-auth"
import { setPendingToast } from "@/lib/pending-toast"

const registerNotes = [
  "Create a workspace for your team.",
  "Use the stock dashboard with clear mobile-friendly screens.",
  "Track which user changed stock from the activity log.",
]

export default function RegisterPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    businessName: "",
    fullName: "",
    emailOrUsername: "",
    password: "",
    confirmPassword: "",
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

    if (!form.businessName.trim()) {
      setError("Enter the business or workspace name.")
      return
    }

    if (!form.fullName.trim()) {
      setError("Enter the account owner or team lead name.")
      return
    }

    if (!form.emailOrUsername.trim()) {
      setError("Enter an email or username.")
      return
    }

    if (form.password.length < 8) {
      setError("Use a password with at least 8 characters.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.")
      return
    }

    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 900))

    const result = registerUser({
      businessName: form.businessName,
      fullName: form.fullName,
      emailOrUsername: form.emailOrUsername,
      password: form.password,
    })

    if ("error" in result) {
      setError(result.error ?? "Unable to create this account.")
      setLoading(false)
      return
    }

    setPendingToast({
      title: "Account created",
      description: "Your workspace is ready.",
    })
    router.push("/dashboard")
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Spinner className="size-4 text-[#009a98]" />
            Preparing registration...
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
              New workspace
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold text-slate-950 sm:text-4xl">
              Create a clean stock workspace for your team
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Register an account, then go straight into the stock dashboard and
              activity log.
            </p>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[440px_minmax(0,1fr)]">
          <section className="rounded-3xl bg-white p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
                Register
              </p>
              <h2 className="text-2xl font-semibold text-slate-950">
                Create account
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Fill in the workspace and owner details below.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Business / Workspace
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={form.businessName}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        businessName: event.target.value,
                      }))
                      setError(null)
                    }}
                    placeholder="Shopline Central"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Full name
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={form.fullName}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                      setError(null)
                    }}
                    placeholder="Ayesha Rahman"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Email / Username
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={form.emailOrUsername}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        emailOrUsername: event.target.value,
                      }))
                      setError(null)
                    }}
                    autoComplete="username"
                    placeholder="owner@shopline.app"
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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="h-12 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Confirm password
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                      setError(null)
                    }}
                    autoComplete="new-password"
                    placeholder="Repeat password"
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-600">
              Already have access?{" "}
              <Link
                href="/"
                className="font-semibold text-[#009a98] hover:text-[#00b8b3]"
              >
                Go to login
              </Link>
            </p>
          </section>

          <section className="rounded-3xl bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#009a98] uppercase">
              What you get
            </p>
            <ul className="mt-4 space-y-3">
              {registerNotes.map((note) => (
                <li
                  key={note}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
