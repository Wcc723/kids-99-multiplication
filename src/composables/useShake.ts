import { onBeforeUnmount, ref, shallowRef } from 'vue'

export function useShake(durationMs: number = 320) {
  const shaking = ref(false)
  const timer = shallowRef<number | null>(null)

  function clearTimer() {
    if (timer.value !== null) {
      window.clearTimeout(timer.value)
      timer.value = null
    }
  }

  function trigger() {
    clearTimer()
    shaking.value = true
    timer.value = window.setTimeout(() => {
      shaking.value = false
      timer.value = null
    }, durationMs)
  }

  onBeforeUnmount(clearTimer)

  return { shaking, trigger }
}
