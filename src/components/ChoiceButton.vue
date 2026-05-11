<script setup lang="ts">
defineProps<{
  value: number
  state?: 'idle' | 'correct' | 'wrong' | 'revealed'
  disabled?: boolean
}>()

defineEmits<{
  (e: 'select', value: number): void
}>()
</script>

<template>
  <button
    type="button"
    class="choice-button"
    :class="['state-' + (state ?? 'idle')]"
    :disabled="disabled"
    @click="$emit('select', value)"
  >
    <span class="paper" aria-hidden="true" />
    <span class="value">{{ value }}</span>
    <span class="sparkle" aria-hidden="true" />
  </button>
</template>

<style scoped>
.choice-button {
  position: relative;
  min-height: 5.5rem;
  padding: 1.25rem 1.4rem;
  border: 2.5px solid var(--color-ink);
  border-radius: 18px 22px 20px 24px;
  background: linear-gradient(180deg, #fff8e3 0%, #f0dfb1 100%);
  color: var(--color-ink);
  font-family: var(--font-numeral);
  font-size: clamp(1.7rem, 4.5vw, 2.4rem);
  font-weight: 700;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.12s ease,
    background-color 0.2s ease,
    box-shadow 0.18s ease;
  overflow: visible;
  isolation: isolate;
}

.paper {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--paper-noise);
  background-size: 220px 220px;
  opacity: 0.7;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: -1;
}

.value {
  position: relative;
  display: inline-block;
}

.sparkle {
  position: absolute;
  inset: -10px;
  pointer-events: none;
  opacity: 0;
}

.choice-button:hover:not(:disabled) {
  transform: translate(-2px, -3px) rotate(-1deg);
  box-shadow: var(--shadow-deep);
}

.choice-button:active:not(:disabled) {
  transform: translate(0, 2px) rotate(0);
  box-shadow: var(--shadow-press);
}

.choice-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.choice-button.state-correct {
  background: linear-gradient(180deg, #a8c686 0%, #6a994e 100%);
  color: #fff8e3;
  border-color: var(--color-correct-deep);
  animation: pop-and-fade 0.6s ease forwards;
}

.choice-button.state-correct .sparkle {
  animation: sparkle-out 0.6s ease forwards;
}

.choice-button.state-correct .sparkle::before,
.choice-button.state-correct .sparkle::after {
  content: '✦';
  position: absolute;
  font-size: 1.4rem;
  color: var(--color-gold);
  text-shadow: 0 0 6px rgba(244, 162, 97, 0.6);
}

.choice-button.state-correct .sparkle::before {
  top: -4px;
  left: 10%;
}

.choice-button.state-correct .sparkle::after {
  bottom: -4px;
  right: 12%;
}

.choice-button.state-wrong {
  background: linear-gradient(180deg, #e8a4a5 0%, #bc4749 100%);
  color: #fff8e3;
  border-color: #8b2f31;
  animation: shake-x 0.42s ease;
}

.choice-button.state-revealed {
  background: linear-gradient(180deg, #c2cebd 0%, #8aa07a 100%);
  color: #fff8e3;
  border-color: var(--color-correct-deep);
  opacity: 0.85;
}

@keyframes pop-and-fade {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  35% {
    transform: scale(1.15) rotate(-3deg);
    opacity: 1;
  }
  70% {
    transform: scale(1.05) rotate(2deg);
    opacity: 0.9;
  }
  100% {
    transform: scale(0.85) rotate(0);
    opacity: 0.25;
  }
}

@keyframes shake-x {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-9px) rotate(-1.5deg);
  }
  45% {
    transform: translateX(9px) rotate(1.5deg);
  }
  70% {
    transform: translateX(-5px) rotate(-0.6deg);
  }
  90% {
    transform: translateX(3px);
  }
}

@keyframes sparkle-out {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  50% {
    opacity: 1;
    transform: scale(1.4);
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
}
</style>
