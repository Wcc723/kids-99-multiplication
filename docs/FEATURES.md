# FEATURES

功能清單與完成狀態。本文件記錄專案**目前實際存在**的功能；未來規劃的功能應先以 [docs/plans/](./plans/) 計畫文件提出，並在完成後同步更新此處。

---

## 狀態說明

| 標記 | 意義                                        |
| ---- | ------------------------------------------- |
| ✅   | 已完成、可使用                              |
| 🚧   | 進行中（對應 `docs/plans/` 有 active 計畫） |
| 📝   | 已規劃但尚未動工                            |
| —    | 尚未規劃                                    |

---

## 基礎建設

| 功能                    | 狀態 | 說明                                                                              |
| ----------------------- | ---- | --------------------------------------------------------------------------------- |
| Vue 3 + TypeScript 樣板 | ✅   | 採 `<script setup>` + Composition API                                             |
| Vite 開發伺服器         | ✅   | `pnpm dev` 啟動，hot-reload 可用                                                  |
| Vue Router 註冊         | ✅   | 三條 route（`/`、`/play`、`/result`）+ `beforeEach` guard，未匹配 fallback 到首頁 |
| Pinia 註冊              | ✅   | setup-style stores（`settings` / `highScores` / `gameSession`）                   |
| 路徑別名 `@` → `src/`   | ✅   | 同時於 `vite.config.ts` 與 `tsconfig.app.json` 設定                               |
| ESLint + oxlint         | ✅   | `pnpm lint` 跑兩者並自動修復                                                      |
| Prettier 格式化         | ✅   | `pnpm format`；專案內 `.claude/hooks/format-prettier.sh` 也會在編輯後自動觸發     |
| 型別檢查                | ✅   | `pnpm type-check`（`vue-tsc --build`），0 errors                                  |
| 建置流程                | ✅   | `pnpm build` 平行跑 type-check + build-only，產出 `dist/`                         |
| 測試框架                | —    | 尚未設定（見 [TESTING.md](./TESTING.md)）                                         |
| CI / CD                 | —    | 尚未設定                                                                          |
| 部署                    | —    | 尚未設定                                                                          |

---

## 遊戲功能

| 功能                 | 狀態 | 說明                                                                                                 |
| -------------------- | ---- | ---------------------------------------------------------------------------------------------------- |
| 首頁 / 主選單        | ✅   | 模式選擇、難度選擇、練習模式開關、音效開關、最高分顯示                                               |
| 三種遊戲模式         | ✅   | classic（A×B=?）、reverse（A×?=C，隱藏左右隨機）、mixed（兩者各半 shuffle）                          |
| 題目產生器           | ✅   | 三難度數字池 + Hard 模式 40% 進階單位數×雙位數題（10-29）                                            |
| 4 選 1 答題介面      | ✅   | 誘餌策略：±1 鄰近、相鄰乘法表、同位數位移、池內補抽                                                  |
| 每題倒數機制         | ✅   | Easy 8s / Medium 6s / Hard 5s；rAF-based、tab 切換自動暫停                                           |
| 練習模式（無倒數）   | ✅   | 預設 OFF；首次進入彈出友善提示；本局不記分                                                           |
| 計分系統             | ✅   | 基礎 100 + 時間獎勵 (timeLeftMs × 0.01) + 連擊加成（最多 +100）+ 進階題 1.5x                         |
| 連擊 combo 顯示      | ✅   | combo ≥ 2 顯示，≥ 5 變大並加擺動動畫                                                                 |
| 動態回饋             | ✅   | 答對 pop-and-fade + 星星，答錯 shake + 紅色震動，倒數歸零紙片塌陷                                    |
| 紙片翻飛過場         | ✅   | Vue `<Transition>` + cubic-bezier，題目切換像翻課本                                                  |
| 結算頁               | ✅   | 分數、答對/錯/逾時/正確率/最佳連擊；破紀錄顯示「★ 新紀錄 ★」並擺動                                   |
| 中途離開確認         | ✅   | 紙質風 `ConfirmDialog` + `beforeRouteLeave` 守衛                                                     |
| 重新開始             | ✅   | 結算頁「再玩一次」（同模式同難度）或「換模式」（回首頁）                                             |
| Local Storage 持久化 | ✅   | `m99:settings`、`m99:highScores`（envelope + version migration）                                     |
| 隱私模式容錯         | ✅   | `safeSetItem`/`safeGetItem` 用 try/catch，失敗 `console.warn` 不中斷                                 |
| 音效 hook            | 🚧   | `useAudio` + `settings.soundEnabled` 結構就緒；音檔目前為 placeholder，需手動補 `public/audio/*.mp3` |
| 多人模式或排行榜     | —    | 不在 MVP 範圍內                                                                                      |
| 答題回顧 / 錯題重練  | —    | 未來版本可加                                                                                         |

> 開始實作任一新功能前，請先於 `docs/plans/` 建立計畫文件（命名 `YYYY-MM-DD-<feature>.md`），參考 [DEVELOPMENT.md](./DEVELOPMENT.md#計畫歸檔流程)。

---

## 行為描述

### 遊戲模式

| 模式      | 題目組成                            | 說明                                    |
| --------- | ----------------------------------- | --------------------------------------- |
| `classic` | 100% `A × B = ?`                    | 看到完整算式，求結果                    |
| `reverse` | 100% `A × ? = C`                    | 反推被隱藏的乘數；隱藏側（左 / 右）隨機 |
| `mixed`   | 50% `product` + 50% `reverseFactor` | 兩種題型隨機混合並 shuffle，挑戰反應    |

### 三段難度

| 難度     | 數字池 / 進階規則                                                  | 每題秒數 |
| -------- | ------------------------------------------------------------------ | -------- |
| `easy`   | A ∈ {2, 3, 5}，B ∈ [1..9]                                          | 8 s      |
| `medium` | A、B ∈ [1..9]                                                      | 6 s      |
| `hard`   | 60% 同 medium；40% 進階：A ∈ [2..9]，B ∈ [10..29]，計分套 **1.5×** | 5 s      |

### 計分公式

```
score += round(
  (100 + timeLeftMs * 0.01 + min(combo - 1, 5) * 20)
  * (isAdvanced ? 1.5 : 1)
)
```

- **timeout**：combo 歸零、`timeoutCount++`，**不扣分**。
- **答錯**：combo 歸零、`wrongCount++`，**不扣分**。
- **練習模式**：本局分數不寫入 `highScores`。

### LocalStorage Schema

```jsonc
// m99:settings
{ "v": 1, "data": {
  "soundEnabled": true,
  "lastMode": "classic",
  "lastDifficulty": "easy",
  "practiceMode": false,
  "firstTimeHintShown": false
}}

// m99:highScores
{ "v": 1, "data": { "classic:easy": 1200, "mixed:hard": 1500 }}
```

寫入失敗（Safari ITP / 私密模式 `QuotaExceededError`）會 `console.warn` 但不中斷遊戲；資料為「最佳努力」儲存。

### 路由 Guard 行為

- 進入 `/play` 時若 `gameSession.status !== 'playing'` → 自動轉址 `/`。
- 進入 `/result` 時若 `gameSession.status !== 'finished'` → 自動轉址 `/`。
- 中途離開（瀏覽器返回 / 點離開按鈕）→ `ConfirmDialog` 確認；確認後 `gameSession.reset()` 再放行。

### 視覺設計（手繪紙質繪本風）

- 字體：英文 / 數字 `Caveat`（手寫）+ `Fredoka`（圓潤 display）；中文 `Klee One` + `Noto Sans TC`（從 Google Fonts 載入）。
- 主色：米黃紙底（`#f7eedb`）/ 焦褐墨（`#3d2a1f`）/ 橙紅重點（`#e76f51`）/ 青綠輔助（`#2a9d8f`）。
- 紙質紋理：SVG `feTurbulence` inline 作為 multiply blend；輔以細水平規線紙背景。
- 裝飾：紙膠帶（masking tape）、手繪虛線邊框、墨水暈染 keyframe。
- 動畫：純 CSS keyframes + Vue `<Transition>`，無外部動畫庫。
