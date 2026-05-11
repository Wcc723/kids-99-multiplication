<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
  }>(),
  {
    title: '提醒',
    message: '確定要這麼做嗎？',
    confirmText: '確定',
    cancelText: '取消',
  },
)

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Transition name="dialog-fade">
    <div v-if="open" class="dialog-overlay" role="dialog" aria-modal="true">
      <div class="dialog-card">
        <span class="tape tape-top" aria-hidden="true" />
        <h2 class="dialog-title">{{ title }}</h2>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn cancel" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
          <button type="button" class="btn confirm" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(61, 42, 31, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.dialog-card {
  position: relative;
  background: var(--paper-noise), linear-gradient(180deg, #fff8e3 0%, #f0dfb1 100%);
  background-blend-mode: multiply, normal;
  border-radius: 22px 26px 24px 22px;
  padding: 1.8rem 1.6rem 1.4rem;
  max-width: 26rem;
  width: 100%;
  box-shadow: var(--shadow-deep);
  border: 2.5px solid var(--color-ink);
  transform: rotate(-0.8deg);
  animation: paper-rise 0.4s ease backwards;
}

.tape {
  position: absolute;
  height: 22px;
  width: 84px;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  background: var(--tape-yellow);
  border-radius: 2px;
  box-shadow: 0 1px 0 rgba(61, 42, 31, 0.15);
}

.dialog-title {
  margin: 0 0 0.6rem;
  font-family: var(--font-hand);
  font-size: 2rem;
  color: var(--color-ink);
}

.dialog-message {
  margin: 0 0 1.4rem;
  font-family: var(--font-body);
  color: var(--color-ink-soft);
  line-height: 1.55;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn {
  padding: 0.65rem 1.4rem;
  border-radius: 14px 18px 16px 20px;
  border: 2.5px solid var(--color-ink);
  font-family: var(--font-hand);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: transform 0.12s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: var(--shadow-press);
}

.btn.cancel {
  background: var(--color-paper);
  color: var(--color-ink);
}

.btn.confirm {
  background: linear-gradient(180deg, var(--color-orange) 0%, var(--color-orange-deep) 100%);
  color: #fff8e3;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.22s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
