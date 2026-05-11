import { STORAGE_VERSION } from '@/game/constants'
import type { PersistedEnvelope } from '@/game/types'

export function wrap<T>(data: T): PersistedEnvelope<T> {
  return { v: STORAGE_VERSION, data }
}

export function unwrap<T>(
  raw: string | null,
  defaultValue: T,
  migrate?: (rawData: unknown, fromVersion: number) => T,
): T {
  if (raw === null) return defaultValue

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return defaultValue

    const envelope = parsed as Partial<PersistedEnvelope<unknown>>
    if (typeof envelope.v !== 'number' || !('data' in envelope)) {
      return defaultValue
    }

    if (envelope.v === STORAGE_VERSION) {
      return envelope.data as T
    }

    if (envelope.v < STORAGE_VERSION && migrate) {
      try {
        return migrate(envelope.data, envelope.v)
      } catch (err) {
        console.warn('[storage] migrate failed, falling back to default', err)
        return defaultValue
      }
    }

    return defaultValue
  } catch (err) {
    console.warn('[storage] parse failed, falling back to default', err)
    return defaultValue
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch (err) {
    console.warn(`[storage] setItem failed for "${key}"`, err)
  }
}

export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch (err) {
    console.warn(`[storage] getItem failed for "${key}"`, err)
    return null
  }
}
