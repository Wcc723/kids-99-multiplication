import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/game/constants'
import type { Difficulty, GameMode, HighScoreKey, HighScoreMap } from '@/game/types'
import { usePersistedRef } from '@/composables/usePersistedRef'

function makeKey(mode: GameMode, difficulty: Difficulty): HighScoreKey {
  return `${mode}:${difficulty}` as HighScoreKey
}

function migrateHighScores(rawData: unknown): HighScoreMap {
  if (!rawData || typeof rawData !== 'object') return {}
  const out: HighScoreMap = {}
  for (const [key, value] of Object.entries(rawData as Record<string, unknown>)) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key as HighScoreKey] = value
    }
  }
  return out
}

export const useHighScoresStore = defineStore('highScores', () => {
  const scores = usePersistedRef<HighScoreMap>(
    STORAGE_KEYS.highScores,
    {},
    {
      migrate: migrateHighScores,
    },
  )

  function get(mode: GameMode, difficulty: Difficulty): number {
    return scores.value[makeKey(mode, difficulty)] ?? 0
  }

  function isBetter(mode: GameMode, difficulty: Difficulty, score: number): boolean {
    return score > get(mode, difficulty)
  }

  function record(
    mode: GameMode,
    difficulty: Difficulty,
    score: number,
  ): { broke: boolean; previous: number } {
    const previous = get(mode, difficulty)
    if (score > previous) {
      scores.value = { ...scores.value, [makeKey(mode, difficulty)]: score }
      return { broke: true, previous }
    }
    return { broke: false, previous }
  }

  function reset() {
    scores.value = {}
  }

  return {
    scores,
    get,
    isBetter,
    record,
    reset,
  }
})
