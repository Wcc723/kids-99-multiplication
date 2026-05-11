<script setup lang="ts">
import { computed } from 'vue'
import type { GameMode } from '@/game/types'

const props = defineProps<{
  mode: GameMode
  title: string
  description: string
  selected?: boolean
}>()

defineEmits<{
  (e: 'select', mode: GameMode): void
}>()

const decoration = computed(() => {
  if (props.mode === 'classic') return '＋'
  if (props.mode === 'reverse') return '？'
  return '✦'
})

const tilt = computed(() => {
  if (props.mode === 'classic') return -1.5
  if (props.mode === 'reverse') return 0.8
  return -0.6
})
</script>

<template>
  <button
    type="button"
    class="mode-card"
    :class="{ selected }"
    :data-mode="mode"
    :style="{ '--tilt': `${tilt}deg` }"
    :aria-pressed="selected ? 'true' : 'false'"
    @click="$emit('select', mode)"
  >
    <span class="stamp" aria-hidden="true">{{ decoration }}</span>
    <span class="title">{{ title }}</span>
    <span class="description">{{ description }}</span>
    <span v-if="selected" class="check" aria-hidden="true">✓ 已選</span>
  </button>
</template>

<style scoped>
.mode-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 1.4rem 1.5rem 1.2rem;
  min-width: 220px;
  flex: 1 1 220px;
  border: 2.5px solid var(--color-ink);
  border-radius: 20px 24px 22px 18px;
  background: var(--paper-noise), linear-gradient(160deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  color: var(--color-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transform: rotate(var(--tilt, 0deg));
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.mode-card:hover {
  transform: rotate(var(--tilt, 0deg)) translateY(-4px);
  box-shadow: var(--shadow-deep);
}

.mode-card.selected {
  background:
    var(--paper-noise),
    linear-gradient(160deg, var(--color-orange) 0%, var(--color-orange-deep) 100%);
  background-blend-mode: multiply, normal;
  color: #fff8e3;
  transform: rotate(calc(var(--tilt, 0deg) * -1)) translateY(-4px);
  box-shadow: var(--shadow-deep);
}

.mode-card[data-mode='reverse'].selected {
  background:
    var(--paper-noise), linear-gradient(160deg, var(--color-teal) 0%, var(--color-teal-deep) 100%);
  background-blend-mode: multiply, normal;
}

.mode-card[data-mode='mixed'].selected {
  background:
    var(--paper-noise), linear-gradient(160deg, var(--color-rose) 0%, var(--color-orange-deep) 100%);
  background-blend-mode: multiply, normal;
}

.stamp {
  position: absolute;
  top: 14px;
  right: 16px;
  font-family: var(--font-hand);
  font-size: 2.6rem;
  color: var(--color-ink-faint);
  transform: rotate(-12deg);
  pointer-events: none;
}

.mode-card.selected .stamp {
  color: rgba(255, 248, 227, 0.55);
}

.title {
  font-family: var(--font-hand);
  font-size: 1.85rem;
  font-weight: 700;
  line-height: 1;
}

.description {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.92;
}

.check {
  position: absolute;
  bottom: -12px;
  left: 14px;
  padding: 0.15rem 0.6rem;
  background: var(--color-paper);
  border: 2px solid var(--color-ink);
  border-radius: 999px;
  font-family: var(--font-hand);
  font-size: 0.9rem;
  color: var(--color-ink);
  transform: rotate(-4deg);
}
</style>
