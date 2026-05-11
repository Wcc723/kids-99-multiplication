import { useSettingsStore } from '@/stores/settings'

type AudioKey = 'correct' | 'wrong' | 'tick' | 'finish'

interface ToneSpec {
  freq: number
  startAt: number
  durationMs: number
  type?: OscillatorType
  gain?: number
  glideTo?: number
}

type AudioContextCtor = typeof AudioContext

const PATTERNS: Record<AudioKey, ToneSpec[]> = {
  // 答對：兩聲清脆上揚「叮 → 叮」
  correct: [
    { freq: 659.25, startAt: 0, durationMs: 130, type: 'triangle', gain: 0.18 }, // E5
    { freq: 987.77, startAt: 0.1, durationMs: 200, type: 'triangle', gain: 0.18 }, // B5
  ],
  // 答錯：低音下滑「嗚～」
  wrong: [
    {
      freq: 220,
      startAt: 0,
      durationMs: 320,
      glideTo: 110,
      type: 'sawtooth',
      gain: 0.14,
    },
  ],
  // 嘀嗒：短促 click，倒數最後幾秒可選用
  tick: [{ freq: 880, startAt: 0, durationMs: 50, type: 'square', gain: 0.08 }],
  // 結束：C-E-G-C 上升和弦
  finish: [
    { freq: 523.25, startAt: 0, durationMs: 200, type: 'triangle', gain: 0.16 }, // C5
    { freq: 659.25, startAt: 0.16, durationMs: 200, type: 'triangle', gain: 0.16 }, // E5
    { freq: 783.99, startAt: 0.32, durationMs: 200, type: 'triangle', gain: 0.16 }, // G5
    { freq: 1046.5, startAt: 0.5, durationMs: 380, type: 'triangle', gain: 0.2 }, // C6
  ],
}

let sharedCtx: AudioContext | null = null
let unlockBound = false

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null
  if (typeof window.AudioContext === 'function') return window.AudioContext
  const webkit = (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
  return typeof webkit === 'function' ? webkit : null
}

function getCtx(): AudioContext | null {
  if (sharedCtx) return sharedCtx
  const Ctor = getAudioContextCtor()
  if (!Ctor) return null
  try {
    sharedCtx = new Ctor()
    bindUnlock(sharedCtx)
    return sharedCtx
  } catch {
    return null
  }
}

// 首次 user gesture 後解鎖 AudioContext（Safari / Chrome autoplay policy）
function bindUnlock(ctx: AudioContext) {
  if (unlockBound) return
  unlockBound = true
  const unlock = () => {
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {})
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('touchstart', unlock)
  }
  window.addEventListener('pointerdown', unlock, { once: false })
  window.addEventListener('keydown', unlock, { once: false })
  window.addEventListener('touchstart', unlock, { once: false })
}

function playTone(ctx: AudioContext, spec: ToneSpec) {
  const now = ctx.currentTime + spec.startAt
  const durationSec = spec.durationMs / 1000
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = spec.type ?? 'sine'
  osc.frequency.setValueAtTime(spec.freq, now)
  if (spec.glideTo !== undefined) {
    osc.frequency.linearRampToValueAtTime(spec.glideTo, now + durationSec)
  }

  const peak = spec.gain ?? 0.16
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(peak, now + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec)

  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + durationSec + 0.05)
}

export function useAudio() {
  const settings = useSettingsStore()

  function play(key: AudioKey) {
    if (!settings.soundEnabled) return
    const ctx = getCtx()
    if (!ctx) return

    const fire = () => {
      const tones = PATTERNS[key]
      if (!tones) return
      for (const tone of tones) {
        try {
          playTone(ctx, tone)
        } catch {
          // swallow individual tone failure
        }
      }
    }

    if (ctx.state === 'suspended') {
      void ctx.resume().then(fire).catch(fire)
    } else {
      fire()
    }
  }

  return {
    playCorrect: () => play('correct'),
    playWrong: () => play('wrong'),
    playTick: () => play('tick'),
    playFinish: () => play('finish'),
  }
}
