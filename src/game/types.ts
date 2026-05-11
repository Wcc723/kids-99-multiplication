export type GameMode = 'classic' | 'reverse' | 'mixed'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionShape = 'product' | 'reverseFactor'
export type AnswerOutcome = 'correct' | 'wrong' | 'timeout'
export type SessionStatus = 'idle' | 'playing' | 'finished'

export interface Question {
  id: string
  shape: QuestionShape
  operandA: number
  operandB: number
  product: number
  answer: number
  choices: number[]
  hiddenSide?: 'left' | 'right'
  isAdvanced?: boolean
}

export interface RoundConfig {
  mode: GameMode
  difficulty: Difficulty
  count: number
}

export interface GameResult {
  mode: GameMode
  difficulty: Difficulty
  score: number
  correctCount: number
  wrongCount: number
  timeoutCount: number
  maxCombo: number
  brokeRecord: boolean
  previousHighScore: number
}

export interface Settings {
  soundEnabled: boolean
  lastMode: GameMode
  lastDifficulty: Difficulty
  practiceMode: boolean
  firstTimeHintShown: boolean
}

export type HighScoreKey = `${GameMode}:${Difficulty}`
export type HighScoreMap = Partial<Record<HighScoreKey, number>>

export interface PersistedEnvelope<T> {
  v: number
  data: T
}
