<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '@/game/types'

const props = defineProps<{
  question: Question
}>()

const display = computed(() => {
  const q = props.question
  if (q.shape === 'product') {
    return { left: String(q.operandA), right: String(q.operandB), result: '?' }
  }
  if (q.hiddenSide === 'left') {
    return { left: '?', right: String(q.operandB), result: String(q.product) }
  }
  return { left: String(q.operandA), right: '?', result: String(q.product) }
})
</script>

<template>
  <article class="question-card" :data-shape="question.shape">
    <span class="tape tape-l" aria-hidden="true" />
    <span class="tape tape-r" aria-hidden="true" />

    <div class="expression">
      <span class="operand" :class="{ blank: display.left === '?' }">
        {{ display.left }}
      </span>
      <span class="op" aria-hidden="true">×</span>
      <span class="operand" :class="{ blank: display.right === '?' }">
        {{ display.right }}
      </span>
      <span class="op" aria-hidden="true">=</span>
      <span class="operand result" :class="{ blank: display.result === '?' }">
        {{ display.result }}
      </span>
    </div>

    <p class="hint">
      <template v-if="question.shape === 'product'">算算看，結果是多少？</template>
      <template v-else>填入問號的數字！</template>
    </p>
  </article>
</template>

<style scoped>
.question-card {
  position: relative;
  padding: 2rem 2.4rem 1.6rem;
  background-color: #fff8e3;
  background-image:
    var(--paper-noise),
    repeating-linear-gradient(
      180deg,
      transparent 0,
      transparent 30px,
      rgba(42, 157, 143, 0.1) 30px,
      rgba(42, 157, 143, 0.1) 31px
    );
  background-blend-mode: multiply, normal;
  border-radius: 22px 26px 24px 22px;
  border: 2.5px solid var(--color-ink);
  box-shadow:
    var(--shadow-deep),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: rotate(-1.2deg);
  animation: paper-rise 0.45s ease backwards;
  min-width: min(420px, 92vw);
  text-align: center;
}

.tape {
  position: absolute;
  height: 24px;
  width: 78px;
  top: -14px;
  background: var(--tape-yellow);
  box-shadow: 0 1px 0 rgba(61, 42, 31, 0.15);
  transform-origin: center;
}

.tape::before,
.tape::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 4px 50%, transparent 3px, var(--tape-yellow) 3.5px) repeat-x,
    var(--tape-yellow);
  background-size: 8px 100%;
  opacity: 0.65;
}

.tape-l {
  left: 26px;
  transform: rotate(-12deg);
  background: var(--tape-pink);
}

.tape-l::before {
  background: var(--tape-pink);
}

.tape-r {
  right: 26px;
  transform: rotate(8deg);
  background: var(--tape-teal);
}

.tape-r::before {
  background: var(--tape-teal);
}

.expression {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45em;
  font-family: var(--font-numeral);
  font-size: clamp(2.6rem, 8vw, 4.4rem);
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: 0.04em;
  line-height: 1;
}

.operand {
  display: inline-block;
  min-width: 0.7em;
}

.operand.blank {
  color: var(--color-orange);
  font-family: var(--font-hand);
  border-bottom: 3px dashed var(--color-orange);
  padding: 0 0.25em 0.06em;
  animation: wiggle 1.4s ease-in-out infinite;
}

.op {
  font-family: var(--font-hand);
  color: var(--color-teal-deep);
  font-weight: 500;
  font-size: 0.85em;
  transform: translateY(-0.06em);
}

.hint {
  margin: 1.1rem 0 0;
  font-family: var(--font-hand);
  font-size: 1.3rem;
  color: var(--color-ink-soft);
}
</style>
