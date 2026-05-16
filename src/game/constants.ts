import type { Difficulty, GameMode, Settings } from '@/game/types'

export const QUESTIONS_PER_ROUND = 10

export const TIME_LIMITS_MS: Record<Difficulty, number> = {
  easy: 8000,
  medium: 6000,
  hard: 5000,
}

export const DIFFICULTY_POOLS: Record<Difficulty, readonly number[]> = {
  easy: [2, 3, 5],
  medium: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  hard: [1, 2, 3, 4, 5, 6, 7, 8, 9],
}

export const HARD_ADVANCED_RATIO = 0.4
export const HARD_TWO_DIGIT_RANGE: readonly [number, number] = [10, 29]

export const SCORE_RULES = {
  basePerCorrect: 100,
  timeBonusPerMs: 0.01,
  comboBonus: (combo: number): number => Math.min(Math.max(combo - 1, 0), 5) * 20,
  hardAdvancedMultiplier: 1.5,
} as const

export const STORAGE_KEYS = {
  settings: 'm99:settings',
  highScores: 'm99:highScores',
} as const

export const STORAGE_VERSION = 1

export const GAME_MODES: readonly GameMode[] = ['classic', 'reverse', 'mixed']
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']

export const MODE_LABELS: Record<GameMode, string> = {
  classic: '經典模式',
  reverse: '反推模式',
  mixed: '混合衝刺',
}

export const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  classic: '看到算式算結果，A × B = ?',
  reverse: '反推被藏起來的那個數，A × ? = C',
  mixed: '兩種題型隨機混合，挑戰你的反應',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '簡單',
  medium: '普通',
  hard: '困難',
}

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: '只練 2、3、5 的乘法表',
  medium: '完整 1～9 的九九乘法',
  hard: '九九乘法 ＋ 進階雙位數題',
}

export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  lastMode: 'classic',
  lastDifficulty: 'easy',
  practiceMode: false,
  firstTimeHintShown: false,
  showAnswerHint: false,
}
