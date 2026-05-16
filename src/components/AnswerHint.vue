<script setup lang="ts">
import type { Question } from '@/game/types'

defineProps<{
  question: Question
}>()
</script>

<template>
  <article class="answer-hint" role="status" aria-live="polite">
    <span class="tape" aria-hidden="true" />
    <span class="badge" aria-hidden="true">💡</span>
    <div class="content">
      <p class="label">正確答案</p>
      <p class="equation">
        <span class="num">{{ question.operandA }}</span>
        <span class="op">×</span>
        <span class="num">{{ question.operandB }}</span>
        <span class="op">=</span>
        <span class="num result">{{ question.product }}</span>
      </p>
    </div>
  </article>
</template>

<style scoped>
.answer-hint {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1.4rem 0.95rem 1.2rem;
  background-color: var(--color-paper);
  background-image: var(--paper-noise);
  background-blend-mode: multiply;
  border: 2.5px dashed var(--color-correct-deep);
  border-radius: 18px 22px 20px 24px;
  box-shadow: var(--shadow-soft);
  transform: rotate(-0.8deg);
  min-width: min(360px, 90vw);
  max-width: min(460px, 94vw);
  animation: hint-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.tape {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  width: 68px;
  height: 20px;
  background: var(--tape-teal);
  box-shadow: 0 1px 0 rgba(61, 42, 31, 0.15);
}

.badge {
  font-size: 1.8rem;
  line-height: 1;
  animation: badge-wiggle 1.2s ease-in-out infinite;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.label {
  margin: 0;
  font-family: var(--font-hand);
  font-size: 1.15rem;
  color: var(--color-ink-soft);
  letter-spacing: 0.05em;
}

.equation {
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 0.35em;
  font-family: var(--font-numeral);
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.1;
}

.num {
  display: inline-block;
}

.op {
  font-family: var(--font-hand);
  color: var(--color-teal-deep);
  font-weight: 500;
  font-size: 0.85em;
  transform: translateY(-0.04em);
}

.result {
  color: var(--color-correct-deep);
  border-bottom: 3px solid var(--color-correct-deep);
  padding: 0 0.15em 0.04em;
}

@keyframes hint-pop {
  0% {
    opacity: 0;
    transform: translateY(-8px) rotate(-3deg) scale(0.85);
  }
  60% {
    opacity: 1;
    transform: translateY(2px) rotate(-0.4deg) scale(1.04);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(-0.8deg) scale(1);
  }
}

@keyframes badge-wiggle {
  0%,
  100% {
    transform: rotate(-6deg) scale(1);
  }
  50% {
    transform: rotate(8deg) scale(1.1);
  }
}

@media (max-width: 480px) {
  .answer-hint {
    padding: 0.75rem 1rem 0.8rem;
    gap: 0.6rem;
  }

  .badge {
    font-size: 1.5rem;
  }

  .label {
    font-size: 1rem;
  }
}
</style>
