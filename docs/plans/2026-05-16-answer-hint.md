# 2026-05-16 — 答錯時顯示正確答案提示

## 動機

MVP 的答錯回饋僅有音效與震動，800ms 後便進入下一題，孩子不知道正確答案為何，學習效果有限。為強化「學習」屬性，需在答錯／超時後顯示完整算式提示。

## UX 設計

- 在題目卡片下方、選項按鈕上方額外彈出一個**紙片風格提示框**，內容為「💡 正確答案：A × B = product」。
- **僅於 `lastOutcome === 'wrong' || 'timeout'` 時顯示**；答對維持原本快節奏（不顯示提示）。
- **停留時間統一為 1800ms** 後再切下一題（原本答錯 800ms、超時 900ms）。
- 嚴格依使用者選定的「只顯示提示框」方案；題目卡的 `?` 與選項按鈕的視覺**不另作高亮**。

## 變更

### 新增

- `src/components/AnswerHint.vue`：紙片風 + 虛線綠框 + 紙膠帶；標籤用 `--font-hand`、算式用 `--font-numeral`；含 `hint-pop` 彈跳進場 keyframes 與 `badge-wiggle` 小動畫；`@media (max-width: 480px)` 處理行動裝置縮排。

### 修改

- `src/views/PlayView.vue`：
  - import `AnswerHint`
  - `handleTimeout` 將 `scheduleAdvance(900)` 改為 `scheduleAdvance(1800)`
  - `onSelect` 答錯分支將 `scheduleAdvance(800)` 改為 `scheduleAdvance(1800)`
  - 新增 `showAnswerHint` computed：`lastOutcome === 'wrong' || 'timeout'`
  - template 在 QuestionCard 與 `.choices` 之間插入 `<Transition name="hint-fade">` 包裹的 `<AnswerHint>`
  - `<style scoped>` 新增 `.hint-fade-leave-active` / `.hint-fade-leave-to`（離場淡出；進場由元件自身 keyframe 處理）

## 重用既有資源

- `Question.operandA / operandB / product`（`src/game/types.ts:7-17`）：完整算式所需資料皆已存在
- `useGameSessionStore().lastOutcome`：已正確設定為 `'correct' | 'wrong' | 'timeout'`
- design tokens：`--color-paper`、`--color-ink`、`--paper-noise`、`--shadow-soft`、`--font-hand`、`--font-numeral`、`--color-correct-deep`、`--tape-teal`

## 不動的部分

- `ChoiceButton.vue`、`QuestionCard.vue`、`gameSession` store、計分、音效、震動：完全沒改動。
- 答對流程：仍維持 550ms 快節奏進下一題。

## 驗證結果

- `pnpm type-check`：✅ 0 errors
- `pnpm lint`（oxlint + ESLint）：✅ 0 warnings/errors
- `pnpm format`：✅ Prettier 套用
- 開發伺服器手動驗證：留給日後實機操作（建議測試情境：classic/easy 答錯、超時、答對快節奏、reverse 題型、practice 模式、最後一題答錯）

## 後續可選擴充

- 若要做成「可由設定關閉提示」，只要在 `showAnswerHint` 加上 `&& settings.showHint` 條件，並新增對應 settings 欄位即可。本次保持簡單，預設一律顯示。

## 補充：改為可由使用者勾選控制（同日後續調整）

依使用者後續要求，將提示改為**首頁勾選**才會啟用：

- `src/game/types.ts`：`Settings` 加 `showAnswerHint: boolean`
- `src/game/constants.ts`：`DEFAULT_SETTINGS.showAnswerHint = false`（migration 自動補預設）
- `src/stores/settings.ts`：新增 `showAnswerHint` computed 與 `toggleShowAnswerHint()`
- `src/views/HomeView.vue`：在「練習模式 / 音效」旁多一個「答錯顯示正解」勾選框
- `src/views/PlayView.vue`：
  - `showAnswerHint` computed 加上 `settings.showAnswerHint` gate
  - `scheduleAdvance` 延遲改為 `settings.showAnswerHint ? 1800 : (原本 800/900)`，未開啟時節奏不變

預設 `false`：符合使用者「勾此選項，才會給予正確解答」的語意；既有玩家不會被突然多出來的提示打斷節奏，想要學習輔助時可自行開啟。
