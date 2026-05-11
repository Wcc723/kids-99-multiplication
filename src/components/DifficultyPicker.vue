<script setup lang="ts">
import { computed } from 'vue'
import { DIFFICULTIES, DIFFICULTY_DESCRIPTIONS, DIFFICULTY_LABELS } from '@/game/constants'
import type { Difficulty } from '@/game/types'

defineProps<{
  modelValue: Difficulty
}>()

defineEmits<{
  (e: 'update:modelValue', value: Difficulty): void
}>()

const stars: Record<Difficulty, string> = {
  easy: '★',
  medium: '★★',
  hard: '★★★',
}

const mascot: Record<Difficulty, string> = {
  easy: '🐣',
  medium: '🐰',
  hard: '🦁',
}

const tilt = computed(() => ({
  easy: '-1.2deg',
  medium: '0.6deg',
  hard: '-0.4deg',
}))
</script>

<template>
  <div class="difficulty-picker" role="radiogroup" aria-label="難度選擇">
    <button
      v-for="d in DIFFICULTIES"
      :key="d"
      type="button"
      role="radio"
      :aria-checked="modelValue === d ? 'true' : 'false'"
      class="pick"
      :class="{ active: modelValue === d }"
      :style="{ '--tilt': tilt[d] }"
      @click="$emit('update:modelValue', d)"
    >
      <span class="mascot" aria-hidden="true">{{ mascot[d] }}</span>
      <span class="label">{{ DIFFICULTY_LABELS[d] }}</span>
      <span class="stars" aria-hidden="true">{{ stars[d] }}</span>
      <span class="desc">{{ DIFFICULTY_DESCRIPTIONS[d] }}</span>
    </button>
  </div>
</template>

<style scoped>
.difficulty-picker {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.pick {
  position: relative;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem 1.25rem 1.1rem;
  border: 2.5px solid var(--color-ink);
  border-radius: 20px 22px 18px 24px;
  background: var(--paper-noise), linear-gradient(160deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  color: var(--color-ink);
  text-align: center;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transform: rotate(var(--tilt, 0deg));
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.pick:hover {
  transform: rotate(0) translateY(-3px);
  box-shadow: var(--shadow-deep);
}

.pick.active {
  background:
    var(--paper-noise), linear-gradient(160deg, var(--color-teal) 0%, var(--color-teal-deep) 100%);
  background-blend-mode: multiply, normal;
  color: #fff8e3;
  transform: rotate(0) translateY(-3px);
  box-shadow: var(--shadow-deep);
}

.mascot {
  font-size: 2.4rem;
  line-height: 1;
  filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.18));
}

.label {
  font-family: var(--font-hand);
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
}

.stars {
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--color-orange);
}

.pick.active .stars {
  color: var(--color-gold);
}

.desc {
  font-family: var(--font-body);
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.35;
}
</style>
