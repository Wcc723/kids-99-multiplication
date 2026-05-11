import { useSettingsStore } from '@/stores/settings'

type AudioKey = 'correct' | 'wrong' | 'tick' | 'finish'

const SRC_MAP: Record<AudioKey, string> = {
  correct: '/audio/correct.mp3',
  wrong: '/audio/wrong.mp3',
  tick: '/audio/tick.mp3',
  finish: '/audio/finish.mp3',
}

const cache = new Map<AudioKey, HTMLAudioElement>()

function getAudio(key: AudioKey): HTMLAudioElement | null {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return null
  const existing = cache.get(key)
  if (existing) return existing
  try {
    const el = new Audio(SRC_MAP[key])
    el.preload = 'auto'
    cache.set(key, el)
    return el
  } catch (err) {
    console.warn(`[useAudio] failed to construct Audio for "${key}"`, err)
    return null
  }
}

export function useAudio() {
  const settings = useSettingsStore()

  function play(key: AudioKey) {
    if (!settings.soundEnabled) return
    const audio = getAudio(key)
    if (!audio) return
    try {
      audio.currentTime = 0
      const promise = audio.play()
      if (promise && typeof promise.then === 'function') {
        promise.catch(() => {
          // placeholder mp3 may not exist yet; silently ignore
        })
      }
    } catch {
      // silently ignore – placeholder audio
    }
  }

  return {
    playCorrect: () => play('correct'),
    playWrong: () => play('wrong'),
    playTick: () => play('tick'),
    playFinish: () => play('finish'),
  }
}
