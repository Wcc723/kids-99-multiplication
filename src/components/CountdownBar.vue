<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  progress: number
  msLeft: number
  practice?: boolean
}>()

const fillStyle = computed(() => ({
  transform: `scaleX(${Math.max(0, Math.min(1, props.progress))})`,
}))

const phase = computed<'safe' | 'warn' | 'danger'>(() => {
  if (props.progress > 0.5) return 'safe'
  if (props.progress > 0.25) return 'warn'
  return 'danger'
})

const displaySeconds = computed(() => {
  if (props.practice) return '∞'
  return (props.msLeft / 1000).toFixed(1)
})
</script>

<template>
  <div class="countdown-bar" :data-phase="practice ? 'practice' : phase">
    <span class="icon" aria-hidden="true">⏱</span>
    <div class="track">
      <div class="fill" :style="fillStyle">
        <span class="dashes" aria-hidden="true" />
      </div>
    </div>
    <span class="time-text">
      <strong>{{ displaySeconds }}</strong>
      <span class="unit">s</span>
    </span>
  </div>
</template>

<style scoped>
.countdown-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.55rem 0.85rem;
  background: rgba(255, 248, 227, 0.7);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-soft);
}

.icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.1));
}

.track {
  position: relative;
  flex: 1;
  height: 18px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      135deg,
      rgba(61, 42, 31, 0.07) 0,
      rgba(61, 42, 31, 0.07) 4px,
      transparent 4px,
      transparent 8px
    ),
    rgba(61, 42, 31, 0.12);
  overflow: hidden;
  border: 1.5px solid var(--color-ink);
}

.fill {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  background: linear-gradient(180deg, #8aa07a 0%, var(--color-correct) 100%);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 999px;
}

.dashes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255, 248, 227, 0.55) 0 8px,
    transparent 8px 16px
  );
  mix-blend-mode: overlay;
}

.countdown-bar[data-phase='warn'] .fill {
  background: linear-gradient(180deg, #f4d28a 0%, var(--color-warning) 100%);
}

.countdown-bar[data-phase='danger'] .fill {
  background: linear-gradient(180deg, #e89094 0%, var(--color-wrong) 100%);
  animation: pulse 0.5s ease-in-out infinite;
  box-shadow: 0 0 18px rgba(188, 71, 73, 0.45);
}

.countdown-bar[data-phase='practice'] .fill {
  background: linear-gradient(135deg, var(--color-rose) 0%, var(--color-teal) 100%);
  transform: scaleX(1) !important;
  opacity: 0.85;
}

.time-text {
  min-width: 3.6rem;
  text-align: right;
  font-family: var(--font-numeral);
  font-weight: 700;
  color: var(--color-ink);
}

.time-text strong {
  font-size: 1.15rem;
}

.time-text .unit {
  font-family: var(--font-hand);
  font-size: 0.95rem;
  margin-left: 0.1rem;
  color: var(--color-ink-soft);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}
</style>
