import { computed, onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'

export interface UseCountdownReturn {
  msLeft: Readonly<Ref<number>>
  progress: Readonly<Ref<number>>
  isRunning: Readonly<Ref<boolean>>
  start: (totalMs?: number) => void
  pause: () => void
  resume: () => void
  reset: (totalMs?: number) => void
  stop: () => void
}

export function useCountdown(initialTotalMs: number, onTimeout?: () => void): UseCountdownReturn {
  const total = ref(initialTotalMs)
  const msLeft = ref(initialTotalMs)
  const isRunning = ref(false)
  const rafId = shallowRef<number | null>(null)
  const lastTimestamp = shallowRef<number | null>(null)

  const progress = computed(() => {
    if (total.value <= 0) return 0
    return Math.max(0, Math.min(1, msLeft.value / total.value))
  })

  function cancelFrame() {
    if (rafId.value !== null) {
      cancelAnimationFrame(rafId.value)
      rafId.value = null
    }
  }

  function tick(timestamp: number) {
    if (!isRunning.value) return
    if (lastTimestamp.value === null) {
      lastTimestamp.value = timestamp
      rafId.value = requestAnimationFrame(tick)
      return
    }
    const delta = timestamp - lastTimestamp.value
    lastTimestamp.value = timestamp
    msLeft.value = Math.max(0, msLeft.value - delta)
    if (msLeft.value <= 0) {
      isRunning.value = false
      cancelFrame()
      onTimeout?.()
      return
    }
    rafId.value = requestAnimationFrame(tick)
  }

  function start(totalMs?: number) {
    cancelFrame()
    if (typeof totalMs === 'number') total.value = totalMs
    msLeft.value = total.value
    lastTimestamp.value = null
    isRunning.value = true
    rafId.value = requestAnimationFrame(tick)
  }

  function pause() {
    if (!isRunning.value) return
    isRunning.value = false
    cancelFrame()
    lastTimestamp.value = null
  }

  function resume() {
    if (isRunning.value || msLeft.value <= 0) return
    isRunning.value = true
    lastTimestamp.value = null
    rafId.value = requestAnimationFrame(tick)
  }

  function reset(totalMs?: number) {
    cancelFrame()
    if (typeof totalMs === 'number') total.value = totalMs
    msLeft.value = total.value
    isRunning.value = false
    lastTimestamp.value = null
  }

  function stop() {
    cancelFrame()
    isRunning.value = false
    msLeft.value = 0
    lastTimestamp.value = null
  }

  onBeforeUnmount(() => {
    cancelFrame()
    isRunning.value = false
  })

  return {
    msLeft,
    progress,
    isRunning,
    start,
    pause,
    resume,
    reset,
    stop,
  }
}
