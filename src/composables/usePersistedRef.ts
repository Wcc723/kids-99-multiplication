import { ref, watch, type Ref } from 'vue'
import { safeGetItem, safeSetItem, unwrap, wrap } from '@/game/storage'

export interface UsePersistedRefOptions<T> {
  migrate?: (rawData: unknown, fromVersion: number) => T
  deep?: boolean
}

export function usePersistedRef<T>(
  key: string,
  defaultValue: T,
  options: UsePersistedRefOptions<T> = {},
): Ref<T> {
  const initial = unwrap(safeGetItem(key), defaultValue, options.migrate)
  const state = ref(initial) as Ref<T>

  watch(
    state,
    (value) => {
      try {
        const payload = JSON.stringify(wrap(value))
        safeSetItem(key, payload)
      } catch (err) {
        console.warn(`[usePersistedRef] serialize failed for "${key}"`, err)
      }
    },
    { deep: options.deep ?? true },
  )

  return state
}
