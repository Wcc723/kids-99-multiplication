<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GAME_MODES, MODE_DESCRIPTIONS, MODE_LABELS } from '@/game/constants'
import type { GameMode } from '@/game/types'
import { useSettingsStore } from '@/stores/settings'
import { useHighScoresStore } from '@/stores/highScores'
import { useGameSessionStore } from '@/stores/gameSession'
import ModeCard from '@/components/ModeCard.vue'
import DifficultyPicker from '@/components/DifficultyPicker.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const settings = useSettingsStore()
const highScores = useHighScoresStore()
const session = useGameSessionStore()

const selectedMode = ref<GameMode>(settings.lastMode)
const showFirstTimeHint = ref(false)

onMounted(() => {
  session.reset()
  if (!settings.firstTimeHintShown) {
    showFirstTimeHint.value = true
  }
})

function selectMode(mode: GameMode) {
  selectedMode.value = mode
  settings.setLastMode(mode)
}

const currentHigh = computed(() => highScores.get(selectedMode.value, settings.lastDifficulty))

function onDifficultyUpdate(value: typeof settings.lastDifficulty) {
  settings.setLastDifficulty(value)
}

function start() {
  session.startGame(selectedMode.value, settings.lastDifficulty, settings.practiceMode)
  router.push({ name: 'play' })
}

function togglePractice() {
  settings.togglePractice()
}

function toggleSound() {
  settings.toggleSound()
}

function dismissHint(enablePractice: boolean) {
  if (enablePractice) {
    settings.practiceMode = true
  }
  settings.markFirstTimeHintShown()
  showFirstTimeHint.value = false
}
</script>

<template>
  <main class="home-view">
    <header class="hero">
      <span class="doodle doodle-pencil" aria-hidden="true">✎</span>
      <span class="doodle doodle-star" aria-hidden="true">✦</span>
      <h1 class="title">
        <span class="title-row">九九乘法</span>
        <span class="title-row sub">練習簿</span>
      </h1>
      <p class="lead">
        翻開練習簿，跟著節奏一起算！
        <br />
        選一個模式、挑一個難度，準備好就開始吧～
      </p>
    </header>

    <section class="panel" aria-labelledby="mode-h">
      <div class="panel-header">
        <h2 id="mode-h" class="section-title">遊戲模式</h2>
        <span class="section-stamp" aria-hidden="true">3 種玩法</span>
      </div>
      <div class="cards">
        <ModeCard
          v-for="m in GAME_MODES"
          :key="m"
          :mode="m"
          :title="MODE_LABELS[m]"
          :description="MODE_DESCRIPTIONS[m]"
          :selected="selectedMode === m"
          @select="selectMode"
        />
      </div>
    </section>

    <section class="panel" aria-labelledby="diff-h">
      <div class="panel-header">
        <h2 id="diff-h" class="section-title">難度</h2>
        <span class="section-stamp" aria-hidden="true">慢慢來</span>
      </div>
      <DifficultyPicker
        :model-value="settings.lastDifficulty"
        @update:model-value="onDifficultyUpdate"
      />
    </section>

    <section class="options">
      <label class="toggle">
        <input type="checkbox" :checked="settings.practiceMode" @change="togglePractice" />
        <span class="box" aria-hidden="true">{{ settings.practiceMode ? '✓' : '' }}</span>
        練習模式
        <span class="hint-text">（沒有倒數壓力）</span>
      </label>
      <label class="toggle">
        <input type="checkbox" :checked="settings.soundEnabled" @change="toggleSound" />
        <span class="box" aria-hidden="true">{{ settings.soundEnabled ? '✓' : '' }}</span>
        音效
      </label>
    </section>

    <section class="cta">
      <div class="record">
        <span class="record-label">目前最高分</span>
        <span class="record-value">{{ currentHigh }}</span>
        <span class="record-meta">{{ MODE_LABELS[selectedMode] }}</span>
      </div>
      <button class="start-btn" type="button" @click="start">
        <span class="start-arrow" aria-hidden="true">➜</span>
        <span class="start-text">開始挑戰</span>
      </button>
    </section>

    <ConfirmDialog
      :open="showFirstTimeHint"
      title="第一次玩嗎？"
      message="想先用「練習模式」沒有倒數壓力地暖身嗎？隨時可在首頁切換喔。"
      confirm-text="開啟練習模式"
      cancel-text="直接開始"
      @confirm="dismissHint(true)"
      @cancel="dismissHint(false)"
    />
  </main>
</template>

<style scoped>
.home-view {
  max-width: 940px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  position: relative;
  text-align: center;
  padding: 1rem 1rem 0.5rem;
}

.doodle {
  position: absolute;
  font-family: var(--font-hand);
  color: var(--color-ink-faint);
  pointer-events: none;
  user-select: none;
}

.doodle-pencil {
  font-size: 2.6rem;
  top: -10px;
  left: 8%;
  transform: rotate(-18deg);
}

.doodle-star {
  font-size: 2.2rem;
  top: 4px;
  right: 10%;
  color: var(--color-orange);
  transform: rotate(14deg);
}

.title {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  font-family: var(--font-hand);
  line-height: 0.95;
  margin: 0;
}

.title-row {
  font-size: clamp(3rem, 9vw, 4.6rem);
  color: var(--color-ink);
  letter-spacing: 0.04em;
  text-shadow:
    2px 2px 0 var(--color-paper-warm),
    4px 4px 0 var(--color-paper-deep);
}

.title-row.sub {
  font-size: clamp(2.2rem, 6vw, 3rem);
  color: var(--color-orange-deep);
  transform: rotate(-2deg);
}

.lead {
  margin: 1rem auto 0;
  max-width: 30rem;
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--color-ink-soft);
  line-height: 1.6;
}

.panel {
  position: relative;
}

.panel-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.section-title {
  font-family: var(--font-hand);
  font-size: 1.8rem;
  color: var(--color-ink);
  margin: 0;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 3.5rem;
  height: 6px;
  margin-top: -3px;
  background: var(--color-orange);
  border-radius: 999px;
  transform: rotate(-1deg);
  opacity: 0.7;
}

.section-stamp {
  display: inline-block;
  padding: 0.15rem 0.7rem;
  background: var(--color-teal);
  color: #fff8e3;
  border-radius: 999px;
  font-family: var(--font-hand);
  font-size: 0.95rem;
  transform: rotate(-3deg);
}

.cards {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
}

.toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle .box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border: 2.5px solid var(--color-ink);
  border-radius: 6px;
  background: var(--color-paper);
  font-family: var(--font-hand);
  font-size: 1.3rem;
  color: var(--color-orange-deep);
}

.toggle input:checked + .box {
  background: var(--color-orange);
  color: #fff8e3;
}

.hint-text {
  font-weight: 500;
  color: var(--color-ink-soft);
  font-size: 0.9rem;
}

.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  flex-wrap: wrap;
  background: var(--paper-noise), linear-gradient(160deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  border: 2.5px solid var(--color-ink);
  border-radius: 24px 18px 26px 20px;
  box-shadow: var(--shadow-soft);
}

.record {
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
}

.record-label {
  font-family: var(--font-hand);
  color: var(--color-ink-soft);
}

.record-value {
  font-family: var(--font-numeral);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-orange-deep);
  line-height: 1;
}

.record-meta {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-ink-soft);
}

.start-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 2rem;
  border-radius: 22px 18px 24px 16px;
  border: 2.5px solid var(--color-ink);
  background: linear-gradient(180deg, var(--color-orange) 0%, var(--color-orange-deep) 100%);
  color: #fff8e3;
  font-family: var(--font-hand);
  font-size: 1.7rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-deep);
  transform: rotate(-2deg);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.start-btn:hover {
  transform: rotate(0) translateY(-3px);
  box-shadow: var(--shadow-deep);
}

.start-btn:active {
  transform: rotate(-2deg) translateY(2px);
  box-shadow: var(--shadow-press);
}

.start-arrow {
  font-size: 1.6rem;
  transition: transform 0.18s ease;
}

.start-btn:hover .start-arrow {
  transform: translateX(4px);
}
</style>
