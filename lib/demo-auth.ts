export type StoredAccount = {
  id: string
  businessName: string
  fullName: string
  emailOrUsername: string
  password: string
}

export type AuthSession = Omit<StoredAccount, "password">

export const DEMO_ACCOUNT: StoredAccount = {
  id: "demo-shopline-admin",
  businessName: "Shopline Preview",
  fullName: "Inventory Lead",
  emailOrUsername: "admin@shopline.app",
  password: "shopline123",
}

const ACCOUNTS_KEY = "shopline.accounts"
const SESSION_KEY = "shopline.session"

function hasWindow() {
  return typeof window !== "undefined"
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback

  try {
    const value = window.localStorage.getItem(key)

    if (!value) return fallback

    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (!hasWindow()) return

  window.localStorage.setItem(key, JSON.stringify(value))
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function toSession(account: StoredAccount): AuthSession {
  return {
    id: account.id,
    businessName: account.businessName,
    fullName: account.fullName,
    emailOrUsername: account.emailOrUsername,
  }
}

function ensureAccounts() {
  const stored = readJson<StoredAccount[]>(ACCOUNTS_KEY, [])

  if (!hasWindow()) {
    return stored.length ? stored : [DEMO_ACCOUNT]
  }

  const hasDemoAccount = stored.some(
    (account) =>
      normalize(account.emailOrUsername) === normalize(DEMO_ACCOUNT.emailOrUsername)
  )

  const accounts = hasDemoAccount
    ? stored
    : stored.length
      ? [DEMO_ACCOUNT, ...stored]
      : [DEMO_ACCOUNT]

  writeJson(ACCOUNTS_KEY, accounts)

  return accounts
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `shopline_${Date.now()}`
}

export function getAuthSession() {
  return readJson<AuthSession | null>(SESSION_KEY, null)
}

export function clearAuthSession() {
  if (!hasWindow()) return

  window.localStorage.removeItem(SESSION_KEY)
}

export function loginUser(identifier: string, password: string) {
  if (!identifier.trim() || !password.trim()) {
    return { error: "Enter your email or username and password." }
  }

  const account = ensureAccounts().find(
    (item) =>
      normalize(item.emailOrUsername) === normalize(identifier) &&
      item.password === password
  )

  if (!account) {
    return {
      error: "Login failed. Check your email or username and password.",
    }
  }

  const session = toSession(account)
  writeJson(SESSION_KEY, session)

  return { session }
}

export function registerUser(input: Omit<StoredAccount, "id">) {
  const accounts = ensureAccounts()

  const alreadyExists = accounts.some(
    (account) =>
      normalize(account.emailOrUsername) === normalize(input.emailOrUsername)
  )

  if (alreadyExists) {
    return {
      error: "That email or username is already registered. Try logging in instead.",
    }
  }

  const account: StoredAccount = {
    id: createId(),
    businessName: input.businessName.trim(),
    fullName: input.fullName.trim(),
    emailOrUsername: input.emailOrUsername.trim(),
    password: input.password,
  }

  const nextAccounts = [...accounts, account]
  writeJson(ACCOUNTS_KEY, nextAccounts)

  const session = toSession(account)
  writeJson(SESSION_KEY, session)

  return { session }
}
