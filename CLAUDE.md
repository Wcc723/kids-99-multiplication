# CLAUDE.md

## 專案概述

**2026-child-99-multiplication** — 兒童九九乘法練習遊戲。

技術棧：Vue 3 + TypeScript + Vite + Pinia + Vue Router，套件管理使用 pnpm。

> 目前處於 `npm create vue@latest` 樣板初始狀態，尚未實作實際的遊戲功能。`src/router/index.ts` 的 routes 為空，`src/App.vue` 僅顯示樣板文字，`src/stores/counter.ts` 為 Pinia 範例 store。

## 常用指令

| 指令 | 用途 |
|------|------|
| `pnpm install` | 安裝相依套件 |
| `pnpm dev` | 啟動 Vite 開發伺服器（hot-reload） |
| `pnpm build` | 平行執行 `type-check` + `build-only`，輸出至 `dist/` |
| `pnpm build-only` | 只跑 Vite 建置（不做型別檢查） |
| `pnpm preview` | 預覽 `dist/` 產物 |
| `pnpm type-check` | 用 `vue-tsc --build` 做型別檢查（增量） |
| `pnpm lint` | 依序執行 `lint:oxlint` 與 `lint:eslint`（皆帶 `--fix`） |
| `pnpm lint:oxlint` | 跑 oxlint（高速 linter）並自動修復 |
| `pnpm lint:eslint` | 跑 ESLint 並自動修復（帶 cache） |
| `pnpm format` | 用 Prettier 格式化 `src/`（experimental CLI） |

## 關鍵規則

- 套件管理一律使用 **pnpm**，不要切換到 npm / yarn（lockfile 為 `pnpm-lock.yaml`）。
- 路徑別名 `@` 對應 `./src`，import 時優先使用 `@/...`（已設定於 `vite.config.ts` 與 `tsconfig.app.json`）。
- `tsconfig.app.json` 啟用 `noUncheckedIndexedAccess`，陣列／物件取值要處理 `undefined`。
- Composition API + `<script setup lang="ts">` 為預設寫法（樣板已採用）。
- 功能開發使用 `docs/plans/` 記錄計畫；完成後移至 `docs/plans/archive/`，並更新 `docs/FEATURES.md` 與 `docs/CHANGELOG.md`。

## 詳細文件

- ./docs/README.md — 項目介紹與快速開始
- ./docs/ARCHITECTURE.md — 架構、目錄結構、資料流
- ./docs/DEVELOPMENT.md — 開發規範、命名規則、計畫歸檔流程
- ./docs/FEATURES.md — 功能列表與完成狀態
- ./docs/TESTING.md — 測試規範與指南（目前尚未設定測試框架）
- ./docs/CHANGELOG.md — 更新日誌

## 必要遵守項目

- 修改原始碼後請先跑 `pnpm type-check`，再跑 `pnpm lint`，最後 `pnpm format`。
- `.editorconfig`、`.prettierrc.json`、`.oxlintrc.json`、`eslint.config.ts` 為格式／lint 真實來源，不要在程式內覆寫其規則。
- 不要直接編輯 `pnpm-lock.yaml`、`node_modules/`、`dist/`。
- 新增第三方依賴前先評估必要性（兒童遊戲應保持輕量），並以 `pnpm add` 安裝。
- Vue Router 目前為 `createWebHistory`，新增路由時遵循 history 模式（不要切到 hash 模式而不討論）。
