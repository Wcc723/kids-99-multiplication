# 2026-child-99-multiplication

兒童九九乘法練習遊戲 — 使用 Vue 3 + Vite + TypeScript 打造的單頁應用（SPA）。

> ⚠️ **目前狀態**：專案剛建立，仍是 `npm create vue@latest` 樣板。`src/App.vue` 顯示 "You did it!"，`src/router/index.ts` 的 routes 為空，遊戲功能尚未實作。本文件記錄的是現有的開發環境與技術棧能力。

---

## 技術棧

| 類別 | 套件 | 版本 |
|------|------|------|
| 前端框架 | Vue | ^3.5.32 |
| 路由 | Vue Router | ^5.0.4 |
| 狀態管理 | Pinia | ^3.0.4 |
| 建置工具 | Vite | ^8.0.8 |
| 語言 | TypeScript | ~6.0.0 |
| Vue Vite 插件 | @vitejs/plugin-vue | ^6.0.6 |
| Devtools 插件 | vite-plugin-vue-devtools | ^8.1.1 |
| 型別檢查 | vue-tsc | ^3.2.6 |
| Linter（主） | ESLint | ^10.2.1 |
| Linter（高速） | oxlint | ~1.60.0 |
| 格式化 | Prettier | 3.8.3 |
| 平行執行 | npm-run-all2 | ^8.0.4 |
| 套件管理 | pnpm | （以 `pnpm-lock.yaml` 為準） |
| Node 需求 | `^20.19.0 \|\| >=22.12.0`（`package.json` engines） |

---

## 快速開始

```sh
# 安裝相依
pnpm install

# 啟動開發伺服器（預設 http://localhost:5173）
pnpm dev

# 建置正式版（型別檢查 + Vite build）
pnpm build

# 預覽建置產物
pnpm preview
```

---

## 常用指令

| 指令 | 用途 |
|------|------|
| `pnpm dev` | 啟動 Vite 開發伺服器 |
| `pnpm build` | 平行執行 `type-check` 與 `build-only` |
| `pnpm build-only` | 只跑 Vite build |
| `pnpm preview` | 預覽建置產物 |
| `pnpm type-check` | `vue-tsc --build` 做型別檢查 |
| `pnpm lint` | 依序執行 `lint:oxlint` → `lint:eslint`（皆 `--fix`） |
| `pnpm lint:oxlint` | oxlint 並自動修復 |
| `pnpm lint:eslint` | ESLint 並自動修復（帶 cache） |
| `pnpm format` | Prettier 格式化 `src/` |

---

## 推薦的 IDE 設定

- **VS Code** + [Vue (Official) Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（停用 Vetur）。
- 專案內 `.vscode/extensions.json` 已預設推薦套件。
- 編輯器設定遵循 `.editorconfig`。

## 推薦的瀏覽器設定

- Chromium 系（Chrome / Edge / Brave）：
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox：
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- 開發時 Vite 會自動掛載 `vite-plugin-vue-devtools` 介面。

---

## 文件索引

| 文件 | 內容 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 目錄結構、模組關係、啟動流程、Vite 設定 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 命名規範、新增頁面 / 路由 / store 的步驟、計畫歸檔流程 |
| [FEATURES.md](./FEATURES.md) | 功能列表與完成狀態（目前皆未開始） |
| [TESTING.md](./TESTING.md) | 測試規範（目前尚未設定測試框架） |
| [CHANGELOG.md](./CHANGELOG.md) | 更新日誌 |

---

## TypeScript 對 `.vue` 的支援

TypeScript 預設無法處理 `.vue` 檔的型別資訊，本專案以 `vue-tsc` 取代 `tsc` 做型別檢查（見 `pnpm type-check`）；VS Code 需安裝 Volar 才能讓 TS language service 認得 `.vue` 型別。
