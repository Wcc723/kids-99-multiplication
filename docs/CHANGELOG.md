# CHANGELOG

依照 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/) 風格記錄重要變更。

---

## [Unreleased]

### Added

- **答錯正確答案提示**（可由首頁勾選控制，預設關閉）：勾選後答錯／超時時，於題目卡片下方彈出紙片風格提示框「💡 正確答案：A × B = C」，停留 1.8 秒後再進下一題；未勾選時維持原本 0.8 秒節奏。新增 `src/components/AnswerHint.vue` 元件、`Settings.showAnswerHint` 欄位（migration 友善：未存在時補預設 false）、`HomeView.vue` 多一個勾選框。詳見 `docs/plans/2026-05-16-answer-hint.md`。
- **遊戲核心邏輯**：三種遊戲模式（classic / reverse / mixed）、三段難度（easy / medium / hard，hard 含 40% 單位數×雙位數進階題）、4 選 1 答題介面、每題倒數機制（rAF-based，tab 切換自動暫停）。
- **計分系統**：基礎 100 + 時間獎勵 + 連擊加成（最多 +100）+ 進階題 1.5× 倍率；timeout / 答錯不扣分。
- **練習模式**：無倒數壓力，首次進入彈出友善提示，本局不記分。
- **持久化**：localStorage envelope（含 schema version）儲存 `m99:settings`、`m99:highScores`；隱私模式失敗 silent fallback。
- **路由與守衛**：三條 route（`/`、`/play`、`/result`）+ `beforeEach` guard 阻擋非法狀態進入。
- **動態回饋**：紙片翻飛過場、答對 pop-and-fade + 星星、答錯 shake、倒數歸零紙片塌陷、連擊 badge。
- **視覺**：手繪紙質繪本風 UI（暖色米黃紙底、Caveat/Fredoka/Klee One/Noto Sans TC 字體、SVG 紙質紋理、紙膠帶與虛線邊框裝飾）。
- **元件庫**：`QuestionCard`、`ChoiceButton`、`CountdownBar`、`ComboBadge`、`ScoreDisplay`、`ModeCard`、`DifficultyPicker`、`ConfirmDialog`、`AnswerHint`。
- **Composables**：`usePersistedRef`、`useCountdown`、`useAudio`、`useShake`。
- **Pinia stores**：`settings`、`highScores`、`gameSession`（皆 setup-style）。
- 文件：`docs/FEATURES.md` 完整列出遊戲行為與設計決策；`docs/plans/archive/2026-05-11-multiplication-game.md` 歸檔完整實作計畫。

### Changed

- `src/App.vue` 從 "You did it!" 樣板改為 `<RouterView />` shell。
- `src/main.ts` 引入 `@/assets/styles/global.css`。
- `index.html` 加入 Google Fonts（Caveat / Fredoka / Klee One / Noto Sans TC）與 `theme-color`。
- `src/router/index.ts` 從空 routes 改為註冊三條 lazy-loaded view + guard。

### Removed

- 移除 `src/stores/counter.ts` 樣板範例 store。

### 初始化（先前）

- 建立 AI 輔助開發文件結構（`CLAUDE.md`、`docs/*`、`.claude/{rules,hooks,agents}`、`.claude/settings.json`）。
- 建立 `docs/plans/` 與 `docs/plans/archive/` 目錄。

---

> 記錄格式：每次發布建立新版本區塊，格式為
> `## [vX.Y.Z] — YYYY-MM-DD`
> 並依 Added / Changed / Deprecated / Removed / Fixed / Security 分類。
