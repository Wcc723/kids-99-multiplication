# CHANGELOG

依照 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/) 風格記錄重要變更。

---

## [Unreleased]

### Added
- 建立 AI 輔助開發文件結構（`CLAUDE.md`、`docs/README.md`、`docs/ARCHITECTURE.md`、`docs/DEVELOPMENT.md`、`docs/FEATURES.md`、`docs/TESTING.md`、`docs/CHANGELOG.md`）。
- 建立 `docs/plans/` 與 `docs/plans/archive/` 目錄用於計畫歸檔。

### 現況
- 專案處於 Vue 3 + Vite + TypeScript 樣板初始狀態。
- `src/App.vue` 僅顯示 "You did it!" 樣板文字。
- `src/router/index.ts` 已建立，`routes` 為空。
- `src/stores/counter.ts` 為 Pinia 範例 store。
- 九九乘法遊戲功能尚未實作。

---

> 記錄格式：每次發布建立新版本區塊，格式為
> `## [vX.Y.Z] — YYYY-MM-DD`
> 並依 Added / Changed / Deprecated / Removed / Fixed / Security 分類。
