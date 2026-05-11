<script setup lang="ts">
defineProps<{
  combo: number
}>()
</script>

<template>
  <Transition name="combo-pop">
    <div
      v-if="combo >= 2"
      class="combo-badge"
      :data-tier="combo >= 5 ? 'high' : 'low'"
      role="status"
    >
      <span class="ribbon-tail left" aria-hidden="true" />
      <span class="combo-text">
        <span class="num">{{ combo }}</span>
        <span class="label">連擊！</span>
      </span>
      <span class="ribbon-tail right" aria-hidden="true" />
    </div>
  </Transition>
</template>

<style scoped>
.combo-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.1rem;
  background: linear-gradient(180deg, var(--color-gold) 0%, var(--color-orange) 100%);
  color: #fff8e3;
  border: 2.5px solid var(--color-ink);
  border-radius: 14px 18px 16px 20px;
  font-family: var(--font-hand);
  font-weight: 700;
  font-size: 1.4rem;
  box-shadow: var(--shadow-soft);
  transform: rotate(-3deg);
  letter-spacing: 0.05em;
}

.combo-badge[data-tier='high'] {
  background: linear-gradient(180deg, var(--color-rose) 0%, var(--color-orange-deep) 100%);
  font-size: 1.7rem;
  padding: 0.55rem 1.4rem;
  animation: wiggle 0.6s ease-in-out infinite;
}

.combo-text {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3em;
  line-height: 1;
}

.num {
  font-family: var(--font-numeral);
  font-size: 1.6em;
  font-weight: 700;
}

.label {
  font-family: var(--font-hand);
}

.ribbon-tail {
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.ribbon-tail.left {
  border-right: 12px solid var(--color-ink);
  transform: translateX(-2px);
}

.ribbon-tail.right {
  border-left: 12px solid var(--color-ink);
  transform: translateX(2px);
}

.combo-pop-enter-active {
  animation: combo-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.combo-pop-leave-active {
  animation: combo-out 0.3s ease-out;
}

@keyframes combo-in {
  0% {
    transform: scale(0) rotate(-15deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.3) rotate(2deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(-3deg);
    opacity: 1;
  }
}

@keyframes combo-out {
  to {
    transform: scale(0.85) rotate(-3deg);
    opacity: 0;
  }
}
</style>
