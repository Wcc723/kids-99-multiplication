---
paths:
  - "src/**/*.vue"
---

# Vue SFC 規則

## SFC 結構順序
- 一律使用 `<script setup lang="ts">`，不寫 Options API。
- 區塊順序：`<script setup>` → `<template>` → `<style scoped>`。
- 不要在同檔混用 setup-style 與 Options 寫法。

## Template
- 元件名稱用 PascalCase：`<GameBoard />` 而非 `<game-board />`。
- 重複渲染必須加 `:key`；`v-for` 不可與 `v-if` 在同一元素（會 lint 警告）。
- 事件處理器命名 `handleXxx` 或 `onXxx`：`@click="handleSubmit"`。
- 屬性與事件用 kebab-case 對外：`<MyComp my-prop="..." @value-change="..." />`。

## Script
- props 用 `defineProps<{ ... }>()`，並提供 TypeScript 型別。
- emit 用 `defineEmits<{ (e: 'submit', payload: Foo): void }>()`。
- ref 用 `ref<T>()` 並標型；template ref 用 `useTemplateRef('xxx')` 或 `const el = ref<HTMLElement | null>(null)`。
- 用 `computed` 派生狀態；不要在 template 寫複雜表達式。
- 副作用統一用 `watch` / `watchEffect` / 生命週期鉤子。

## Style
- 預設 `<style scoped>`；需要全域樣式時用 `:global(...)` 或於 `src/assets/` 全域 import。
- 不要在 Vue 元件內覆蓋 reset 樣式。
- 配色與字級在兒童遊戲應考量易讀性：font-size ≥ 16px，按鈕觸控區 ≥ 44×44px。

## 安全
- 避免使用 `v-html`；若必須使用，內容必須來自可信來源並過濾。
- 不要將使用者輸入直接拼進 `:href`、`:src`（避免 `javascript:` 偽協定）。

## Import
- 從 `src/` 內 import 一律用 `@` 別名：`import Foo from '@/components/Foo.vue'`。
- `.vue` 副檔名必須保留。
