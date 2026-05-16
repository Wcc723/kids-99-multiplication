<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameSessionStore } from '@/stores/gameSession'
import { useSettingsStore } from '@/stores/settings'
import { useCountdown } from '@/composables/useCountdown'
import { useAudio } from '@/composables/useAudio'
import { useShake } from '@/composables/useShake'
import QuestionCard from '@/components/QuestionCard.vue'
import ChoiceButton from '@/components/ChoiceButton.vue'
import CountdownBar from '@/components/CountdownBar.vue'
import ComboBadge from '@/components/ComboBadge.vue'
import ScoreDisplay from '@/components/ScoreDisplay.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import AnswerHint from '@/components/AnswerHint.vue'

const router = useRouter()
const session = useGameSessionStore()
const settings = useSettingsStore()
const audio = useAudio()
const { shaking, trigger: triggerShake } = useShake()

const animatingChoice = ref<number | null>(null)
const advancing = ref(false)
const showLeaveConfirm = ref(false)
const pendingLeave = ref<null | (() => void)>(null)

const countdown = useCountdown(session.timeLimitMs, handleTimeout)

function handleTimeout() {
  if (advancing.value) return
  advancing.value = true
  session.timeoutCurrent()
  audio.playWrong()
  scheduleAdvance(settings.showAnswerHint ? 1800 : 900)
}

function scheduleAdvance(delayMs: number) {
  window.setTimeout(() => {
    if (session.status !== 'playing') return
    const wasLast = session.isLastQuestion
    session.advance()
    animatingChoice.value = null
    advancing.value = false
    if (wasLast) {
      audio.playFinish()
      router.replace({ name: 'result' })
      return
    }
    if (!settings.practiceMode) {
      countdown.start(session.timeLimitMs)
    }
  }, delayMs)
}

function onSelect(value: number) {
  if (advancing.value) return
  if (!session.currentQuestion) return
  advancing.value = true
  animatingChoice.value = value

  const timeLeft = settings.practiceMode ? session.timeLimitMs : countdown.msLeft.value
  if (!settings.practiceMode) countdown.pause()

  const outcome = session.submitAnswer(value, timeLeft)
  if (outcome === 'correct') {
    audio.playCorrect()
    scheduleAdvance(550)
  } else {
    audio.playWrong()
    triggerShake()
    scheduleAdvance(settings.showAnswerHint ? 1800 : 800)
  }
}

const choiceState = (value: number) => {
  if (animatingChoice.value !== value) return 'idle' as const
  if (session.lastOutcome === 'correct') return 'correct' as const
  if (session.lastOutcome === 'wrong') return 'wrong' as const
  return 'idle' as const
}

const choicesDisabled = computed(() => advancing.value)

const showAnswerHint = computed(
  () =>
    settings.showAnswerHint &&
    (session.lastOutcome === 'wrong' || session.lastOutcome === 'timeout'),
)

onMounted(() => {
  if (session.status !== 'playing') {
    router.replace({ name: 'home' })
    return
  }
  if (!settings.practiceMode) {
    countdown.start(session.timeLimitMs)
  }
})

onBeforeUnmount(() => {
  countdown.stop()
})

onBeforeRouteLeave((to, _from, next) => {
  if (to.name === 'result' || session.status !== 'playing') {
    next()
    return
  }
  pendingLeave.value = () => next()
  showLeaveConfirm.value = true
  next(false)
})

watch(
  () => session.currentIndex,
  () => {
    animatingChoice.value = null
  },
)

function confirmLeave() {
  session.reset()
  showLeaveConfirm.value = false
  const cb = pendingLeave.value
  pendingLeave.value = null
  if (cb) cb()
  else router.replace({ name: 'home' })
}

function cancelLeave() {
  showLeaveConfirm.value = false
  pendingLeave.value = null
}

function requestQuit() {
  showLeaveConfirm.value = true
}
</script>

<template>
  <main class="play-view" :class="{ 'is-shaking': shaking }">
    <header class="hud">
      <div class="hud-row primary">
        <CountdownBar
          :progress="settings.practiceMode ? 1 : countdown.progress.value"
          :ms-left="settings.practiceMode ? session.timeLimitMs : countdown.msLeft.value"
          :practice="settings.practiceMode"
        />
        <button class="quit-btn" type="button" @click="requestQuit" aria-label="離開挑戰">
          <span class="quit-icon" aria-hidden="true">×</span>
        </button>
      </div>
      <div class="hud-row secondary">
        <ScoreDisplay
          :score="session.score"
          :progress-current="session.progress.current"
          :progress-total="session.progress.total"
        />
        <ComboBadge :combo="session.combo" />
      </div>
    </header>

    <section class="stage">
      <Transition name="paper-flip" mode="out-in">
        <QuestionCard
          v-if="session.currentQuestion"
          :key="session.currentQuestion.id"
          :question="session.currentQuestion"
        />
      </Transition>

      <Transition name="hint-fade">
        <AnswerHint
          v-if="showAnswerHint && session.currentQuestion"
          :key="`hint-${session.currentQuestion.id}`"
          :question="session.currentQuestion"
        />
      </Transition>

      <div v-if="session.currentQuestion" class="choices">
        <ChoiceButton
          v-for="choice in session.currentQuestion.choices"
          :key="choice"
          :value="choice"
          :state="choiceState(choice)"
          :disabled="choicesDisabled"
          @select="onSelect"
        />
      </div>
    </section>

    <ConfirmDialog
      :open="showLeaveConfirm"
      title="離開挑戰？"
      message="這一局的分數將不會被儲存喔！"
      confirm-text="離開"
      cancel-text="再玩一下"
      @confirm="confirmLeave"
      @cancel="cancelLeave"
    />
  </main>
</template>

<style scoped>
.play-view {
  flex: 1;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.1s ease;
}

.play-view.is-shaking {
  animation: page-shake 0.32s ease;
}

.hud {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.hud-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hud-row.primary > :first-child {
  flex: 1;
}

.hud-row.secondary {
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.quit-btn {
  width: 2.6rem;
  height: 2.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-paper);
  color: var(--color-ink);
  border: 2.5px solid var(--color-ink);
  border-radius: 50% 48% 52% 50%;
  font-family: var(--font-hand);
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.15s ease,
    background-color 0.2s ease;
}

.quit-btn:hover {
  transform: rotate(8deg) scale(1.05);
  background: var(--color-wrong);
  color: #fff8e3;
  border-color: #8b2f31;
}

.quit-icon {
  line-height: 1;
}

.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.2rem;
  padding-top: 1.5rem;
}

.choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  width: min(460px, 100%);
}

.paper-flip-enter-active,
.paper-flip-leave-active {
  transition:
    transform 0.5s cubic-bezier(0.5, 0, 0.3, 1.2),
    opacity 0.4s ease;
}

.paper-flip-enter-from {
  transform: translateX(60%) rotate(8deg) scale(0.92);
  opacity: 0;
}

.paper-flip-leave-to {
  transform: translateX(-40%) rotate(-12deg) scale(0.92);
  opacity: 0;
}

.hint-fade-leave-active {
  transition:
    transform 0.22s ease,
    opacity 0.2s ease;
}

.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) rotate(-2deg) scale(0.94);
}

@keyframes page-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px) rotate(-0.4deg);
  }
  45% {
    transform: translateX(8px) rotate(0.4deg);
  }
  70% {
    transform: translateX(-4px);
  }
}
</style>
