<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameSessionStore } from '@/stores/gameSession'
import { useSettingsStore } from '@/stores/settings'
import { DIFFICULTY_LABELS, MODE_LABELS } from '@/game/constants'

const router = useRouter()
const session = useGameSessionStore()
const settings = useSettingsStore()

onMounted(() => {
  if (session.status !== 'finished' || !session.result) {
    router.replace({ name: 'home' })
  }
})

const result = computed(() => session.result)

const accuracy = computed(() => {
  if (!result.value) return 0
  const total = result.value.correctCount + result.value.wrongCount + result.value.timeoutCount
  if (total === 0) return 0
  return Math.round((result.value.correctCount / total) * 100)
})

const headline = computed(() => {
  if (!result.value) return ''
  if (session.practice) return '練習完成！'
  if (result.value.brokeRecord) return '破紀錄了！'
  if (accuracy.value >= 80) return '太厲害了！'
  if (accuracy.value >= 50) return '繼續加油！'
  return '再挑戰一次吧！'
})

const moodEmoji = computed(() => {
  if (!result.value) return '✦'
  if (session.practice) return '📒'
  if (result.value.brokeRecord) return '🎉'
  if (accuracy.value >= 80) return '🌟'
  if (accuracy.value >= 50) return '💪'
  return '🌱'
})

function playAgain() {
  if (!result.value) return
  session.startGame(result.value.mode, result.value.difficulty, settings.practiceMode)
  router.push({ name: 'play' })
}

function backHome() {
  session.reset()
  router.push({ name: 'home' })
}
</script>

<template>
  <main v-if="result" class="result-view">
    <header class="hero">
      <span class="emoji" aria-hidden="true">{{ moodEmoji }}</span>
      <h1>{{ headline }}</h1>
      <p class="subtitle">
        {{ MODE_LABELS[result.mode] }}
        <span class="dot">·</span>
        {{ DIFFICULTY_LABELS[result.difficulty] }}
      </p>
      <p v-if="session.practice" class="hint">練習模式不會記錄分數喔</p>
    </header>

    <section
      class="score-card"
      :class="{ 'broke-record': result.brokeRecord && !session.practice }"
    >
      <span class="tape" aria-hidden="true" />
      <span class="card-label">本局分數</span>
      <span class="card-value">{{ result.score }}</span>
      <div v-if="result.brokeRecord && !session.practice" class="record-bubble" aria-live="polite">
        <span>★ 新紀錄 ★</span>
        <small>之前最高：{{ result.previousHighScore }}</small>
      </div>
      <div v-else-if="!session.practice" class="record-bubble subtle">
        最高分：{{ result.previousHighScore }}
      </div>
    </section>

    <section class="stats">
      <div class="stat">
        <span class="stat-emoji" aria-hidden="true">🟢</span>
        <span class="stat-label">答對</span>
        <span class="stat-value correct">{{ result.correctCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-emoji" aria-hidden="true">🔴</span>
        <span class="stat-label">答錯</span>
        <span class="stat-value wrong">{{ result.wrongCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-emoji" aria-hidden="true">⏰</span>
        <span class="stat-label">逾時</span>
        <span class="stat-value timeout">{{ result.timeoutCount }}</span>
      </div>
      <div class="stat">
        <span class="stat-emoji" aria-hidden="true">🎯</span>
        <span class="stat-label">正確率</span>
        <span class="stat-value">{{ accuracy }}%</span>
      </div>
      <div class="stat">
        <span class="stat-emoji" aria-hidden="true">⚡</span>
        <span class="stat-label">最佳連擊</span>
        <span class="stat-value">{{ result.maxCombo }}</span>
      </div>
    </section>

    <section class="actions">
      <button class="btn primary" type="button" @click="playAgain">
        <span aria-hidden="true">↻</span> 再玩一次
      </button>
      <button class="btn" type="button" @click="backHome">
        <span aria-hidden="true">←</span> 換模式
      </button>
    </section>
  </main>
</template>

<style scoped>
.result-view {
  max-width: 760px;
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
}

.hero {
  position: relative;
  padding-top: 1rem;
}

.emoji {
  display: block;
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  animation: paper-rise 0.5s ease backwards;
}

.hero h1 {
  font-family: var(--font-hand);
  font-size: clamp(2.6rem, 7vw, 3.4rem);
  margin: 0 0 0.4rem;
  color: var(--color-ink);
  text-shadow: 2px 2px 0 var(--color-paper-warm);
}

.subtitle {
  font-family: var(--font-body);
  color: var(--color-ink-soft);
  font-weight: 600;
  margin: 0;
}

.subtitle .dot {
  color: var(--color-orange);
  margin: 0 0.4rem;
}

.hint {
  margin-top: 0.5rem;
  font-family: var(--font-hand);
  color: var(--color-orange-deep);
  font-size: 1.1rem;
}

.score-card {
  position: relative;
  align-self: center;
  padding: 1.5rem 2.5rem 1.8rem;
  min-width: min(360px, 90vw);
  background: var(--paper-noise), linear-gradient(180deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  border: 2.5px solid var(--color-ink);
  border-radius: 28px 26px 24px 30px;
  box-shadow: var(--shadow-deep);
  transform: rotate(-1deg);
  animation: paper-rise 0.55s ease backwards;
}

.score-card.broke-record {
  background: var(--paper-noise), linear-gradient(180deg, #fce6a3 0%, var(--color-gold) 100%);
  background-blend-mode: multiply, normal;
  animation:
    paper-rise 0.55s ease backwards,
    wiggle 2s ease-in-out infinite 0.55s;
}

.tape {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 90px;
  height: 22px;
  background: var(--tape-pink);
  border-radius: 2px;
  box-shadow: 0 1px 0 rgba(61, 42, 31, 0.15);
}

.card-label {
  display: block;
  font-family: var(--font-hand);
  font-size: 1.2rem;
  color: var(--color-ink-soft);
  letter-spacing: 0.1em;
}

.card-value {
  display: block;
  font-family: var(--font-numeral);
  font-weight: 700;
  font-size: clamp(3rem, 11vw, 5rem);
  line-height: 1;
  color: var(--color-orange-deep);
  margin-top: 0.25rem;
}

.score-card.broke-record .card-value {
  color: var(--color-ink);
}

.record-bubble {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  background: var(--color-ink);
  color: #fff8e3;
  border-radius: 14px 18px 16px 20px;
  font-family: var(--font-hand);
  font-size: 1.15rem;
  transform: rotate(-2deg);
}

.record-bubble.subtle {
  background: transparent;
  color: var(--color-ink-soft);
  transform: none;
  padding: 0;
}

.record-bubble small {
  font-size: 0.85rem;
  opacity: 0.85;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.85rem;
}

.stat {
  padding: 0.9rem 0.85rem 1rem;
  background: var(--paper-noise), linear-gradient(160deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  border: 2.5px solid var(--color-ink);
  border-radius: 16px 20px 18px 22px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.stat:nth-child(odd) {
  transform: rotate(-0.8deg);
}

.stat:nth-child(even) {
  transform: rotate(0.8deg);
}

.stat-emoji {
  font-size: 1.4rem;
}

.stat-label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-ink-soft);
}

.stat-value {
  font-family: var(--font-numeral);
  font-size: 1.6rem;
  font-weight: 700;
}

.stat-value.correct {
  color: var(--color-correct-deep);
}

.stat-value.wrong {
  color: var(--color-wrong);
}

.stat-value.timeout {
  color: var(--color-warning);
}

.actions {
  display: flex;
  gap: 0.85rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.9rem 1.8rem;
  border-radius: 20px 16px 22px 14px;
  border: 2.5px solid var(--color-ink);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-hand);
  font-weight: 700;
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn.primary {
  background: linear-gradient(180deg, var(--color-orange) 0%, var(--color-orange-deep) 100%);
  color: #fff8e3;
}

.btn:hover {
  transform: translateY(-3px) rotate(-1deg);
  box-shadow: var(--shadow-deep);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: var(--shadow-press);
}
</style>
