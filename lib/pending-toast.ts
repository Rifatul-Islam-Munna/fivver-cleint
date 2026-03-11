export type PendingToast = {
  title: string
  description?: string
}

const PENDING_TOAST_KEY = "shopline.pending-toast"

function hasWindow() {
  return typeof window !== "undefined"
}

export function setPendingToast(toast: PendingToast) {
  if (!hasWindow()) return

  window.sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(toast))
}

export function popPendingToast() {
  if (!hasWindow()) return null as PendingToast | null

  const value = window.sessionStorage.getItem(PENDING_TOAST_KEY)

  if (!value) return null

  window.sessionStorage.removeItem(PENDING_TOAST_KEY)

  try {
    return JSON.parse(value) as PendingToast
  } catch {
    return null
  }
}
