import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { generateRound } from '@/game/generator'
import { calcScore } from '@/game/scoring'
import { QUESTIONS_PER_ROUND, TIME_LIMITS_MS } from '@/game/constants'
import type {
  AnswerOutcome,
  Difficulty,
  GameMode,
  GameResult,
  Question,
  SessionStatus,
} from '@/game/types'
import { useHighScoresStore } from '@/stores/highScores'

export const useGameSessionStore = defineStore('gameSession', () => {
  const status = ref<SessionStatus>('idle')
  const mode = ref<GameMode | null>(null)
  const difficulty = ref<Difficulty | null>(null)
  const practice = ref(false)

  const questions = ref<Question[]>([])
  const currentIndex = ref(0)

  const score = ref(0)
  const combo = ref(0)
  const maxCombo = ref(0)
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const timeoutCount = ref(0)

  const lastOutcome = ref<AnswerOutcome | null>(null)
  const lastSelectedChoice = ref<number | null>(null)

  const result = ref<GameResult | null>(null)

  const currentQuestion = computed<Question | null>(
    () => questions.value[currentIndex.value] ?? null,
  )

  const progress = computed(() => ({
    current: Math.min(currentIndex.value + 1, questions.value.length),
    total: questions.value.length,
  }))

  const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)

  const timeLimitMs = computed(() => {
    if (difficulty.value === null) return TIME_LIMITS_MS.easy
    return TIME_LIMITS_MS[difficulty.value]
  })

  function resetCounters() {
    score.value = 0
    combo.value = 0
    maxCombo.value = 0
    correctCount.value = 0
    wrongCount.value = 0
    timeoutCount.value = 0
    lastOutcome.value = null
    lastSelectedChoice.value = null
    result.value = null
  }

  function startGame(nextMode: GameMode, nextDifficulty: Difficulty, isPractice: boolean = false) {
    mode.value = nextMode
    difficulty.value = nextDifficulty
    practice.value = isPractice
    questions.value = generateRound(nextMode, nextDifficulty, QUESTIONS_PER_ROUND)
    currentIndex.value = 0
    resetCounters()
    status.value = 'playing'
  }

  function submitAnswer(choice: number, timeLeftMs: number): AnswerOutcome {
    const question = currentQuestion.value
    if (!question || status.value !== 'playing') return 'wrong'

    lastSelectedChoice.value = choice
    if (choice === question.answer) {
      const nextCombo = combo.value + 1
      combo.value = nextCombo
      maxCombo.value = Math.max(maxCombo.value, nextCombo)
      correctCount.value += 1
      score.value += calcScore({
        timeLeftMs,
        combo: nextCombo,
        isAdvanced: question.isAdvanced === true,
      })
      lastOutcome.value = 'correct'
      return 'correct'
    }

    combo.value = 0
    wrongCount.value += 1
    lastOutcome.value = 'wrong'
    return 'wrong'
  }

  function timeoutCurrent(): AnswerOutcome {
    if (status.value !== 'playing') return 'timeout'
    combo.value = 0
    timeoutCount.value += 1
    lastOutcome.value = 'timeout'
    lastSelectedChoice.value = null
    return 'timeout'
  }

  function advance() {
    if (status.value !== 'playing') return
    if (currentIndex.value + 1 >= questions.value.length) {
      finish()
      return
    }
    currentIndex.value += 1
    lastOutcome.value = null
    lastSelectedChoice.value = null
  }

  function finish() {
    if (mode.value === null || difficulty.value === null) {
      status.value = 'finished'
      return
    }
    const highScores = useHighScoresStore()
    const finalScore = practice.value ? 0 : score.value
    const { broke, previous } = practice.value
      ? { broke: false, previous: highScores.get(mode.value, difficulty.value) }
      : highScores.record(mode.value, difficulty.value, finalScore)

    result.value = {
      mode: mode.value,
      difficulty: difficulty.value,
      score: finalScore,
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      timeoutCount: timeoutCount.value,
      maxCombo: maxCombo.value,
      brokeRecord: broke,
      previousHighScore: previous,
    }
    status.value = 'finished'
  }

  function reset() {
    status.value = 'idle'
    mode.value = null
    difficulty.value = null
    practice.value = false
    questions.value = []
    currentIndex.value = 0
    resetCounters()
  }

  return {
    status,
    mode,
    difficulty,
    practice,
    questions,
    currentIndex,
    score,
    combo,
    maxCombo,
    correctCount,
    wrongCount,
    timeoutCount,
    lastOutcome,
    lastSelectedChoice,
    result,
    currentQuestion,
    progress,
    isLastQuestion,
    timeLimitMs,
    startGame,
    submitAnswer,
    timeoutCurrent,
    advance,
    finish,
    reset,
  }
})
