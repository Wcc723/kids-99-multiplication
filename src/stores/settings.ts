import { defineStore } from 'pinia'
import { computed } from 'vue'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '@/game/constants'
import type { Difficulty, GameMode, Settings } from '@/game/types'
import { usePersistedRef } from '@/composables/usePersistedRef'

function migrateSettings(rawData: unknown): Settings {
  if (!rawData || typeof rawData !== 'object') return { ...DEFAULT_SETTINGS }
  return { ...DEFAULT_SETTINGS, ...(rawData as Partial<Settings>) }
}

export const useSettingsStore = defineStore('settings', () => {
  const state = usePersistedRef<Settings>(
    STORAGE_KEYS.settings,
    { ...DEFAULT_SETTINGS },
    {
      migrate: migrateSettings,
    },
  )

  const soundEnabled = computed({
    get: () => state.value.soundEnabled,
    set: (value) => {
      state.value = { ...state.value, soundEnabled: value }
    },
  })

  const lastMode = computed({
    get: () => state.value.lastMode,
    set: (value) => {
      state.value = { ...state.value, lastMode: value }
    },
  })

  const lastDifficulty = computed({
    get: () => state.value.lastDifficulty,
    set: (value) => {
      state.value = { ...state.value, lastDifficulty: value }
    },
  })

  const practiceMode = computed({
    get: () => state.value.practiceMode,
    set: (value) => {
      state.value = { ...state.value, practiceMode: value }
    },
  })

  const firstTimeHintShown = computed({
    get: () => state.value.firstTimeHintShown,
    set: (value) => {
      state.value = { ...state.value, firstTimeHintShown: value }
    },
  })

  const showAnswerHint = computed({
    get: () => state.value.showAnswerHint,
    set: (value) => {
      state.value = { ...state.value, showAnswerHint: value }
    },
  })

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  function togglePractice() {
    practiceMode.value = !practiceMode.value
  }

  function toggleShowAnswerHint() {
    showAnswerHint.value = !showAnswerHint.value
  }

  function setLastMode(mode: GameMode) {
    lastMode.value = mode
  }

  function setLastDifficulty(difficulty: Difficulty) {
    lastDifficulty.value = difficulty
  }

  function markFirstTimeHintShown() {
    firstTimeHintShown.value = true
  }

  return {
    soundEnabled,
    lastMode,
    lastDifficulty,
    practiceMode,
    firstTimeHintShown,
    showAnswerHint,
    toggleSound,
    togglePractice,
    toggleShowAnswerHint,
    setLastMode,
    setLastDifficulty,
    markFirstTimeHintShown,
  }
})
