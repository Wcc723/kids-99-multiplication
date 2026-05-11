import {
  DIFFICULTY_POOLS,
  HARD_ADVANCED_RATIO,
  HARD_TWO_DIGIT_RANGE,
  QUESTIONS_PER_ROUND,
} from '@/game/constants'
import type { Difficulty, GameMode, Question, QuestionShape } from '@/game/types'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickFrom<T>(pool: readonly T[]): T {
  const idx = Math.floor(Math.random() * pool.length)
  const value = pool[idx]
  if (value === undefined) {
    throw new Error('pickFrom: empty pool')
  }
  return value
}

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = copy[i]
    const b = copy[j]
    if (a !== undefined && b !== undefined) {
      copy[i] = b
      copy[j] = a
    }
  }
  return copy
}

function genId(index: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `q-${index}-${crypto.randomUUID().slice(0, 8)}`
  }
  return `q-${index}-${Math.random().toString(36).slice(2, 10)}`
}

interface OperandSpec {
  operandA: number
  operandB: number
  isAdvanced: boolean
}

function pickOperands(difficulty: Difficulty): OperandSpec {
  if (difficulty === 'easy') {
    const a = pickFrom(DIFFICULTY_POOLS.easy)
    const b = randomInt(1, 9)
    return { operandA: a, operandB: b, isAdvanced: false }
  }

  if (difficulty === 'medium') {
    const a = pickFrom(DIFFICULTY_POOLS.medium)
    const b = pickFrom(DIFFICULTY_POOLS.medium)
    return { operandA: a, operandB: b, isAdvanced: false }
  }

  // hard
  const advanced = Math.random() < HARD_ADVANCED_RATIO
  if (advanced) {
    const a = randomInt(2, 9)
    const [lo, hi] = HARD_TWO_DIGIT_RANGE
    const b = randomInt(lo, hi)
    return { operandA: a, operandB: b, isAdvanced: true }
  }
  const a = pickFrom(DIFFICULTY_POOLS.medium)
  const b = pickFrom(DIFFICULTY_POOLS.medium)
  return { operandA: a, operandB: b, isAdvanced: false }
}

function pickShape(mode: GameMode): QuestionShape {
  if (mode === 'classic') return 'product'
  if (mode === 'reverse') return 'reverseFactor'
  return Math.random() < 0.5 ? 'product' : 'reverseFactor'
}

function generateProductChoices(answer: number, operandA: number, operandB: number): number[] {
  const candidates = new Set<number>([answer])
  const tryAdd = (value: number) => {
    if (Number.isInteger(value) && value >= 1 && value !== answer) {
      candidates.add(value)
    }
  }

  tryAdd(operandA * Math.max(operandB - 1, 1))
  tryAdd(operandA * (operandB + 1))
  tryAdd(Math.max(operandA - 1, 1) * operandB)
  tryAdd((operandA + 1) * operandB)

  if (answer >= 10) {
    const tens = Math.floor(answer / 10)
    const units = answer % 10
    if (units !== 0) tryAdd(units * 10 + tens)
  }

  let safety = 12
  while (candidates.size < 4 && safety-- > 0) {
    tryAdd(answer + randomInt(1, 6))
    tryAdd(Math.max(1, answer - randomInt(1, 6)))
  }

  const choices = Array.from(candidates).slice(0, 4)
  while (choices.length < 4) {
    choices.push(answer + choices.length + 1)
  }
  return shuffle(choices)
}

function generateReverseChoices(answer: number, difficulty: Difficulty): number[] {
  const pool = DIFFICULTY_POOLS[difficulty]
  const candidates = new Set<number>([answer])

  const tryAdd = (value: number) => {
    if (Number.isInteger(value) && value >= 1 && value !== answer) {
      candidates.add(value)
    }
  }

  tryAdd(answer - 1)
  tryAdd(answer + 1)

  const shuffledPool = shuffle(pool)
  for (const value of shuffledPool) {
    if (candidates.size >= 4) break
    tryAdd(value)
  }

  let safety = 12
  while (candidates.size < 4 && safety-- > 0) {
    tryAdd(answer + randomInt(1, 4))
    tryAdd(Math.max(1, answer - randomInt(1, 4)))
  }

  const choices = Array.from(candidates).slice(0, 4)
  while (choices.length < 4) {
    choices.push(answer + choices.length + 1)
  }
  return shuffle(choices)
}

export function generateChoices(
  question: Omit<Question, 'choices'>,
  difficulty: Difficulty,
): number[] {
  if (question.shape === 'product') {
    return generateProductChoices(question.answer, question.operandA, question.operandB)
  }
  return generateReverseChoices(question.answer, difficulty)
}

export function generateQuestion(
  shape: QuestionShape,
  difficulty: Difficulty,
  index: number,
): Question {
  const { operandA, operandB, isAdvanced } = pickOperands(difficulty)
  const product = operandA * operandB

  if (shape === 'product') {
    const base: Omit<Question, 'choices'> = {
      id: genId(index),
      shape,
      operandA,
      operandB,
      product,
      answer: product,
      isAdvanced,
    }
    return { ...base, choices: generateChoices(base, difficulty) }
  }

  const hiddenSide: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
  const answer = hiddenSide === 'left' ? operandA : operandB
  const base: Omit<Question, 'choices'> = {
    id: genId(index),
    shape,
    operandA,
    operandB,
    product,
    answer,
    hiddenSide,
    isAdvanced,
  }
  return { ...base, choices: generateChoices(base, difficulty) }
}

export function generateRound(
  mode: GameMode,
  difficulty: Difficulty,
  count: number = QUESTIONS_PER_ROUND,
): Question[] {
  if (mode === 'mixed') {
    const half = Math.floor(count / 2)
    const shapes: QuestionShape[] = [
      ...Array.from<QuestionShape>({ length: half }).fill('product'),
      ...Array.from<QuestionShape>({ length: count - half }).fill('reverseFactor'),
    ]
    const ordered = shuffle(shapes)
    return ordered.map((shape, i) => generateQuestion(shape, difficulty, i))
  }

  return Array.from({ length: count }, (_, i) => generateQuestion(pickShape(mode), difficulty, i))
}

export const __internal = { shuffle, randomInt, pickFrom }
