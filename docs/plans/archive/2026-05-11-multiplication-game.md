# 兒童 99 乘法練習小遊戲 — 實作計畫

## Context

專案 `2026-child-99-multiplication` 為 Vue 3 + Vite + TypeScript + Pinia 樣板（白板狀態，僅有 counter 範例 store），目標是為 **6-8 歲（國小中低年級）** 兒童開發九九乘法練習小遊戲。

使用者需求：一次一題、每題倒數壓力、兩種題型（A×B=? 與 A×?=C）、三段難度（含進階單位數×雙位數題）、localStorage 紀錄、結算重玩、動態回饋（消除動畫）、**手繪紙質繪本風**（由 frontend-design skill 主導 UI）。

實作期望先打通垂直切片（home→play→result 邏輯可玩），再讓 frontend-design skill 進場處理視覺。

---

## 已拍板的設計決策

| 決策點 | 結果 |
|--------|------|
| 視覺風格 | 手繪紙質繪本風（暖色、手寫體、紙質紋理） |
| 答題介面 | **4 選 1**（6-8 歲打字困難，留 `inputMode` 切換點供 v2） |
| 每題倒數秒數 | Easy 8s / Medium 6s / Hard 5s |
| 每局題數 | 10 題 |
| 困難雙位數範圍 | **10-29**（進階題佔 40%，計分套 1.5× 倍率） |
| 練習模式（無倒數） | **提供**，預設 OFF + 首次進入彈出提示 |
| 音效 | MVP 保留 settings 開關 + `useAudio` 結構，**音檔為 placeholder/silent**，未來手動換成資產 |
| 中途離開 / 重來確認 | **自製 ConfirmDialog.vue**（紙質風一致） |
| Timeout 處理 | combo 歸零 + timeoutCount++，**不扣分**（避免挫折滾雪球） |
| 動畫策略 | 純 CSS keyframes + Vue `<Transition>`，**不引入 GSAP/Motion** |
| CSS 策略 | SFC `<style scoped>` + 全域 `src/assets/styles/{global,tokens}.css`，**不引入 Tailwind/UI 框架** |

---

## 遊戲模式（三種）

1. **classic**（經典）：100% `A × B = ?`
2. **reverse**（反推）：100% `A × ? = C`（隨機隱藏左或右運算元）
3. **mixed**（混合衝刺）：50% / 50% 隨機混合並 shuffle

---

## 檔案結構

```
src/
├── App.vue                          # 改為 <RouterView /> + 全域紙質容器
├── main.ts                          # +import '@/assets/styles/global.css'
├── assets/styles/
│   ├── global.css                   # reset、字體、keyframes(shake/pop-and-fade/paper-flip/pulse)
│   └── tokens.css                   # CSS variables（色票、字級、紋理）
├── router/index.ts                  # 註冊 3 routes + guard
├── game/                            # 純 TS 邏輯（無 Vue 依賴）
│   ├── types.ts                     # Question / GameMode / Difficulty / GameResult / Settings 等
│   ├── constants.ts                 # QUESTIONS_PER_ROUND、TIME_LIMITS_MS、DIFFICULTY_POOLS、SCORE_RULES、STORAGE_KEYS、STORAGE_VERSION
│   ├── generator.ts                 # generateRound / generateProductQuestion / generateReverseQuestion / generateChoices / shuffle
│   ├── scoring.ts                   # calcScore(timeLeftMs, combo, difficulty, isAdvanced)
│   └── storage.ts                   # PersistedEnvelope 讀寫輔助
├── composables/
│   ├── usePersistedRef.ts           # 通用 localStorage 同步（envelope + version migration）
│   ├── useCountdown.ts              # rAF-based 倒數（start/pause/reset/onTimeout）
│   ├── useQuestionGenerator.ts      # 包裝 game/generator.ts
│   ├── useAudio.ts                  # placeholder 音效（settings 開關生效）
│   └── useShake.ts                  # 答錯震動 class toggle
├── stores/
│   ├── settings.ts                  # soundEnabled / lastMode / lastDifficulty / practiceMode / firstTimeHintShown
│   ├── highScores.ts                # Record<`${mode}:${difficulty}`, number>
│   └── gameSession.ts               # 當前一局：status / questions / index / score / combo / lastOutcome 等
├── views/
│   ├── HomeView.vue                 # 模式選擇 + 難度 + 練習模式開關 + 開始
│   ├── PlayView.vue                 # 答題主畫面（HUD + 題目卡 + 4 選項）
│   └── ResultView.vue               # 結算（分數、破紀錄、再玩 / 換模式）
└── components/
    ├── QuestionCard.vue
    ├── ChoiceButton.vue
    ├── CountdownBar.vue
    ├── ComboBadge.vue
    ├── ScoreDisplay.vue
    ├── ModeCard.vue
    ├── DifficultyPicker.vue
    └── ConfirmDialog.vue            # 紙質風確認 Modal（離開/重來）

public/audio/                        # placeholder：correct.mp3 / wrong.mp3 / tick.mp3 / finish.mp3（可暫空檔）
```

新建資料夾：`src/{assets/styles,composables,game,views,components}`。

---

## 核心型別（`src/game/types.ts`）

```ts
type GameMode = 'classic' | 'reverse' | 'mixed'
type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionShape = 'product' | 'reverseFactor'

interface Question {
  id: string                      // crypto.randomUUID() 或 `q-${i}-${rand}`
  shape: QuestionShape
  operandA: number
  operandB: number
  product: number
  answer: number
  choices: number[]               // 4 個，已 shuffle
  hiddenSide?: 'left' | 'right'   // reverseFactor 才用
  isAdvanced?: boolean            // hard 模式中的雙位數題，計分加倍
}

interface GameResult {
  mode: GameMode
  difficulty: Difficulty
  score: number
  correctCount: number
  wrongCount: number
  timeoutCount: number
  maxCombo: number
  brokeRecord: boolean
  previousHighScore: number
}

interface Settings {
  soundEnabled: boolean
  lastMode: GameMode
  lastDifficulty: Difficulty
  practiceMode: boolean
  firstTimeHintShown: boolean
}

type HighScoreKey = `${GameMode}:${Difficulty}`
type HighScoreMap = Partial<Record<HighScoreKey, number>>

interface PersistedEnvelope<T> { v: number; data: T }
```

## 關鍵常數（`src/game/constants.ts`）

```ts
QUESTIONS_PER_ROUND = 10
TIME_LIMITS_MS = { easy: 8000, medium: 6000, hard: 5000 }
DIFFICULTY_POOLS = {
  easy:   [2, 3, 5],
  medium: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  hard:   [1, 2, 3, 4, 5, 6, 7, 8, 9],
}
HARD_ADVANCED_RATIO = 0.4
HARD_TWO_DIGIT_RANGE: [number, number] = [10, 29]   // 使用者選 10-29
SCORE_RULES = {
  basePerCorrect: 100,
  timeBonusPerMs: 0.01,                  // 剩 3000ms → +30
  comboBonus: (n) => Math.min(n - 1, 5) * 20,
  hardAdvancedMultiplier: 1.5,
}
STORAGE_KEYS = { settings: 'm99:settings', highScores: 'm99:highScores' }
STORAGE_VERSION = 1
```

---

## 題目生成規則摘要

| 難度 | 規則 |
|------|------|
| easy | A ∈ {2,3,5}，B ∈ [1..9]；全部單位數 |
| medium | A、B ∈ [1..9] |
| hard | 60% 同 medium；40% 進階：A ∈ [2..9]，B ∈ [10..29]，標 `isAdvanced=true` |

**模式對 shape**：
- classic → 全 `product`
- reverse → 全 `reverseFactor`，隨機 `hiddenSide`
- mixed → 各半，最後 shuffle

**4 選 1 誘餌**：
- `product`：A×(B±1)、(A±1)×B、同位數位移；不夠則 `answer + random(1..5)` 補。
- `reverseFactor`：answer±1、同池內異於 answer 的兩個。
- 共通：去重、≥1 整數、最後 `shuffle(choices)`。

---

## 計分（`src/game/scoring.ts`）

```
score += (basePerCorrect + timeLeftMs * timeBonusPerMs + comboBonus(combo))
         * (isAdvanced ? hardAdvancedMultiplier : 1)
```

Timeout / 答錯：combo 歸 0、不扣分。

---

## 路由

| path | name | view | guard |
|------|------|------|-------|
| `/` | home | HomeView | — |
| `/play` | play | PlayView | session.status !== 'playing' → home |
| `/result` | result | ResultView | session.status !== 'finished' → home |
| `/:pathMatch(.*)*` | not-found | HomeView | — |

---

## State machine

```
[idle] → startGame(mode,difficulty) → [playing]
            ├── submitAnswer(v)      → 正/錯動畫 → advance()
            ├── timeoutCurrent()     → 紙張燒成灰 → advance()
            └── 中途離開 → ConfirmDialog → reset() → home

  advance(): 若 currentIndex+1 === total → finish() → [finished]
  finish(): highScoresStore.record(...) → router.replace('/result')

[finished]
  ├── 再玩一次 → startGame(同) → [playing]
  └── 換模式   → reset() → home → [idle]
```

---

## localStorage Schema

```json
// m99:settings
{ "v": 1, "data": {
    "soundEnabled": true,
    "lastMode": "classic",
    "lastDifficulty": "easy",
    "practiceMode": false,
    "firstTimeHintShown": false
}}

// m99:highScores
{ "v": 1, "data": {
    "classic:easy": 1200,
    "mixed:hard": 1500
}}
```

`usePersistedRef` 處理：version 不符 → migrate 或回 default；私密瀏覽 QuotaExceededError → console.warn 不中斷遊戲。

---

## Critical Files

關鍵實作檔（依重要性）：
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/game/types.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/game/constants.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/game/generator.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/stores/gameSession.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/composables/useCountdown.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/composables/usePersistedRef.ts`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/views/PlayView.vue`
- `/Users/casper/Github/2026-child-99-multiplication/2026-child-99-multiplication/src/router/index.ts`

需修改的既有檔：
- `src/App.vue` — 改為 `<RouterView />` + 全域容器
- `src/main.ts` — `import '@/assets/styles/global.css'`
- `src/router/index.ts` — 註冊三條 routes + guard

可重用的現有 utilities：**無**（白板專案，所有邏輯皆需新建）。`src/stores/counter.ts` 範例 store 可作為 setup-style 寫法參照，但不直接使用——實作完成後可刪除。

---

## 實作 Tasks（依序）

1. 建立 `src/game/{types,constants}.ts`。
2. 實作 `src/game/{generator,scoring}.ts`（純函式）。
3. 實作 `src/composables/{usePersistedRef,useCountdown}.ts` + `src/game/storage.ts`。
4. 實作三個 Pinia stores（`settings.ts`、`highScores.ts`、`gameSession.ts`）。
5. 在 `src/router/index.ts` 註冊三條 route（占位 view），確認導航。
6. 改寫 `src/App.vue` 為 `<RouterView />`、`main.ts` 引入 global.css（先空）。
7. 實作 **HomeView 邏輯雛形**（裸 button 選 mode/difficulty/practice，啟動 → /play）。
8. 實作 **PlayView 邏輯雛形**（顯示題目 + 4 button + 倒數文字 + 自動 advance）。
9. 實作 **ResultView 邏輯雛形**（分數、破紀錄旗標、再玩/換模式）。
10. 拆出 8 個共用元件殼（QuestionCard / ChoiceButton / CountdownBar / ComboBadge / ScoreDisplay / ModeCard / DifficultyPicker / ConfirmDialog），定義 props/emits。**此時遊戲 100% 可玩**。
11. 實作 `useAudio` + `useShake`；`public/audio/` 放空 MP3（任何免費 0 秒檔，或產生 silent.mp3）。
12. 撰寫 `src/assets/styles/{global,tokens}.css`：CSS variables、keyframes（shake / pop-and-fade / paper-flip / pulse / burn）、reset。
13. 在 PlayView 接 `lastOutcome` watcher + `<Transition>` + class toggle，完成動態回饋。
14. 加入 `beforeRouteLeave` + ConfirmDialog 確認流程。
15. **frontend-design skill 進場**（見下節），對所有 view + components 套手繪紙質繪本風。
16. 首次進入彈出 practiceMode 提示（讀 `firstTimeHintShown`）。
17. 移除 `src/stores/counter.ts`（範例）。
18. `pnpm type-check` → `pnpm lint` → `pnpm format`；更新 `docs/FEATURES.md`、`docs/CHANGELOG.md`；`git mv` 本計畫到 `docs/plans/archive/`。

---

## frontend-design skill 整合介面

**進場時機**：Task 10 完成後（所有元件 props/emits 已凍結）。

**由 frontend-design 主導**：
- views/{HomeView, PlayView, ResultView}.vue
- components/{QuestionCard, ChoiceButton, CountdownBar, ComboBadge, ScoreDisplay, ModeCard, DifficultyPicker, ConfirmDialog}.vue
- assets/styles/{global, tokens}.css

**規則**：
- 只能改 `<template>` 標籤結構 / class、`<style scoped>` 樣式。
- **不可改**：props 名稱、emit 名稱、`<script setup>` 邏輯、store/composable 介面。
- 採暖色基底、手繪標題 + 規矩數字字體（中文字體授權於該階段選擇，避免初次載入過大）。

---

## Verification（端對端測試）

實作完成後依序執行：

1. **本地驗證指令**：
   ```sh
   pnpm install
   pnpm type-check     # 應 0 errors
   pnpm lint           # 應 0 errors
   pnpm build          # 應成功產出 dist/
   pnpm dev            # http://localhost:5173
   ```

2. **手動 E2E 流程**（在瀏覽器跑一遍）：
   - 首次進入 `/` → 看到 practiceMode 提示彈出 → 關閉。
   - 選 `classic` + `easy` → 開始 → 進入 `/play`。
   - 答 10 題：刻意混合答對 / 答錯 / 不答（讓倒數歸零） → 觀察動畫、combo、score、HUD 是否合理。
   - 結束自動進 `/result` → 看到分數、最高分標記、`再玩一次` 與 `換模式` 都能用。
   - 重整頁面 → 回 `/` → 看到「上次選擇」預填、最高分留存。
   - 開瀏覽器 DevTools → Application → Local Storage：應看到 `m99:settings`、`m99:highScores` 兩 key，內容符合 envelope 格式。
   - 切到 `hard` 難度 → 應出現 `9 × 23 = ?` 這類進階題（10-29 範圍）。
   - 切到 `reverse` → 出 `A × ? = C` 題型，隱藏位置左右隨機。
   - 中途按瀏覽器返回 → ConfirmDialog 彈出。
   - 開啟 practiceMode → CountdownBar 應為靜態裝飾，不會歸零。
   - Safari 私密模式試一次 → 答完一局，console 有 warn 但不中斷。

3. **跨難度抽查**：每難度玩 3 局，確認題目分布合理（easy 必含 2/3/5、hard 約 4/10 是進階題）。

---

## 不在 MVP 範圍內（已劃線）

- 多人 / 排行榜 / 雲端同步
- 答題回顧 / 錯題重練
- 「分享分數」按鈕（ResultView 暫不顯示）
- 數字鍵盤輸入（已留 `inputMode` 擴充點）
- PWA / 離線使用
- 中文手寫字體實際選型（frontend-design 階段決定，需評估授權與檔案大小）
- 真實音效資產（先以靜音 placeholder 上線）
- 智慧誘餌（針對常見錯誤背誦給特定干擾選項）

---

## 風險與注意事項

- **倒數壓力 vs 學習挫折**：以 practiceMode + timeout 不扣分 + Easy 8s 緩衝；若 playtesting 發現仍挫折，可下調 `HARD_ADVANCED_RATIO` 或拉長秒數。
- **localStorage 在 Safari ITP / 私密模式失效**：try/catch 不中斷遊戲、不對使用者顯示警告；FEATURES.md 註明為「最佳努力」儲存。
- **placeholder 音檔**：MP3 空檔在某些瀏覽器可能 `error` event，`useAudio` 內需 silently catch。
- **動畫過場時長（500/800/800ms）**需要 playtesting；實作後與使用者確認。
- **進階題出現比例 40%** 可能對部分 hard 玩家偏多/偏少；數值集中在 `constants.ts` 容易調。
