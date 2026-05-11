<script setup lang="ts">
defineProps<{
  score: number
  progressCurrent: number
  progressTotal: number
}>()
</script>

<template>
  <div class="score-display">
    <div class="block score-block">
      <span class="label">分數</span>
      <span class="value">{{ score }}</span>
    </div>
    <div class="divider" aria-hidden="true" />
    <div class="block progress-block">
      <span class="label">第</span>
      <span class="value">
        <strong>{{ progressCurrent }}</strong>
        <span class="slash">/</span>
        <span class="total">{{ progressTotal }}</span>
      </span>
      <span class="label">題</span>
    </div>
  </div>
</template>

<style scoped>
.score-display {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 1.1rem;
  background: linear-gradient(180deg, #fff8e3 0%, #f0dfb1 100%);
  border: 2.5px solid var(--color-ink);
  border-radius: 16px 20px 18px 22px;
  box-shadow: var(--shadow-soft);
  transform: rotate(0.6deg);
}

.block {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: var(--font-hand);
}

.label {
  font-size: 1rem;
  color: var(--color-ink-soft);
}

.value {
  font-family: var(--font-numeral);
  font-weight: 700;
  font-size: 1.7rem;
  color: var(--color-ink);
  line-height: 1;
}

.score-block .value {
  color: var(--color-orange-deep);
  font-size: 1.85rem;
}

.divider {
  width: 1.5px;
  height: 28px;
  background: repeating-linear-gradient(180deg, var(--color-ink) 0 4px, transparent 4px 8px);
}

.progress-block .slash {
  color: var(--color-ink-faint);
  margin: 0 0.1em;
}

.progress-block .total {
  font-size: 1.2rem;
  color: var(--color-ink-soft);
}
</style>
