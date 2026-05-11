import { SCORE_RULES } from '@/game/constants'

export interface ScoreInput {
  timeLeftMs: number
  combo: number
  isAdvanced: boolean
}

export function calcScore({ timeLeftMs, combo, isAdvanced }: ScoreInput): number {
  const base = SCORE_RULES.basePerCorrect
  const timeBonus = Math.max(0, timeLeftMs) * SCORE_RULES.timeBonusPerMs
  const comboBonus = SCORE_RULES.comboBonus(combo)
  const multiplier = isAdvanced ? SCORE_RULES.hardAdvancedMultiplier : 1
  return Math.round((base + timeBonus + comboBonus) * multiplier)
}
