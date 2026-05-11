# DEVELOPMENT

開發規範與常用流程。本文件假設你已閱讀 [ARCHITECTURE.md](./ARCHITECTURE.md)。

---

## 環境需求

| 工具 | 版本 |
|------|------|
| Node.js | `^20.19.0 \|\| >=22.12.0`（見 `package.json` 的 `engines`） |
| 套件管理器 | **pnpm**（lockfile 為 `pnpm-lock.yaml`） |

> 不要切換到 npm / yarn — 會產生衝突的 lockfile。

---

## 環境變數

目前**未使用任何環境變數**。Vite 預設提供以下內建變數可在程式內取用：

| 變數 | 用途 | 必要性 | 預設值 |
|------|------|--------|--------|
| `import.meta.env.MODE` | `development` / `production` | 自動 | Vite 提供 |
| `import.meta.env.BASE_URL` | SPA base path（用於 router） | 自動 | `/` |
| `import.meta.env.DEV` | 是否為開發模式 | 自動 | true/false |
| `import.meta.env.PROD` | 是否為正式建置 | 自動 | true/false |

未來若需自訂環境變數，請：
1. 於專案根目錄建立 `.env`、`.env.development`、`.env.production`（已被 `.gitignore` 的 `*.local` 模式排除部分）。
2. 變數名稱前綴必須為 `VITE_`，否則 Vite 不會 expose 到 client。
3. 於 `env.d.ts` 補上 `ImportMetaEnv` 型別宣告。

---

## 命名規則對照表

| 類型 | 命名規則 | 範例 |
|------|----------|------|
| Vue 元件檔案 | PascalCase `.vue` | `GameBoard.vue`、`QuestionCard.vue` |
| 元件名稱（template 用） | PascalCase | `<GameBoard />` |
| 頁面元件（views） | PascalCase + `View` 或 `Page` 後綴 | `HomeView.vue`、`GamePage.vue` |
| Composition function | camelCase + `use` 前綴 | `useTimer.ts`、`useScore.ts` |
| Pinia store | camelCase + `use` 前綴 + `Store` 後綴 | `useGameStore`、`useCounterStore` |
| Pinia store 檔案 | camelCase | `game.ts`、`counter.ts` |
| Router 設定 | camelCase | `index.ts` |
| TS 型別 / interface | PascalCase | `Question`、`GameState` |
| Enum / Const 字面值 | UPPER_SNAKE_CASE | `MAX_LEVEL`、`DEFAULT_TIMEOUT` |
| 變數 / 函式 | camelCase | `score`、`generateQuestion()` |
| CSS class（scoped） | kebab-case | `.game-board`、`.question-card` |

---

## 模組系統

- 全專案為 ES Modules（`package.json` 設定 `"type": "module"`）。
- 一律使用 `import` / `export`，不使用 `require`。
- 路徑：
  - **專案內** → 使用 `@/...` 別名（對應 `src/`），避免長串相對路徑。
  - **同目錄或鄰近檔** → 可用相對路徑 `./foo`、`../bar`。
- `.vue` 檔的 import 必須帶 `.vue` 副檔名：`import App from './App.vue'`。
- 預設使用 `<script setup lang="ts">` 寫 SFC（樣板已採用）。

---

## 新增頁面（Route + View）

1. 於 `src/views/` 建立 `XxxView.vue`（若 `views/` 不存在則一併建立）。
2. 於 `src/router/index.ts` 的 `routes` 陣列新增條目，**優先使用 lazy import**：
   ```ts
   {
     path: '/play',
     name: 'play',
     component: () => import('@/views/PlayView.vue'),
   }
   ```
3. 若需動態參數：用 `:param` 並在元件內以 `useRoute().params` 取用。
4. 在元件需要的位置放 `<RouterLink to="/play">` 或程式用 `useRouter().push('/play')`。

---

## 新增 Pinia Store

1. 於 `src/stores/` 建立 `featureName.ts`。
2. 採用 **setup-style**（與 `counter.ts` 範例一致）：
   ```ts
   import { ref, computed } from 'vue'
   import { defineStore } from 'pinia'

   export const useGameStore = defineStore('game', () => {
     const score = ref(0)
     const isHighScore = computed(() => score.value >= 100)
     function addScore(n: number) { score.value += n }

     return { score, isHighScore, addScore }
   })
   ```
3. store id（`defineStore` 第一個參數）必須**全專案唯一**，建議直接用檔名。
4. 元件內使用：`const game = useGameStore()`；若需解構保留 reactivity，使用 `storeToRefs(game)`。

---

## 新增 Composable

1. 於 `src/composables/` 建立 `useXxx.ts`（若目錄不存在則新增）。
2. 函式名以 `use` 開頭。
3. 回傳值優先用 `readonly()` / `computed()` 包裝對外暴露的 state，內部以 `ref` / `reactive` 持有。
4. 副作用（`onMounted`、`watch` 等）寫在函式內，呼叫方在 setup context 使用。

---

## 樣式撰寫

- 預設使用 SFC `<style scoped>`，避免污染全域。
- 全域樣式（例如 reset、字型）放於 `src/assets/` 並在 `main.ts` 顯式 `import`。
- 目前**沒有**安裝任何 CSS 框架；若日後加入（如 Tailwind、UnoCSS）需先於本文件記錄。
- 兒童應用要注意：font-size 大、對比強、按鈕觸控區大（最小 44×44 px）。

---

## 提交前檢查清單

每次完成一段修改後，依序：

```sh
pnpm type-check    # 型別錯誤先解決
pnpm lint          # oxlint + eslint 自動修復
pnpm format        # Prettier 格式化 src/
```

> 若 `pnpm build` 在 CI 失敗，通常是 `vue-tsc` 抓到型別問題，請先在本機跑 `pnpm type-check` 重現。

---

## 計畫歸檔流程

> 所有非瑣碎功能開發都應先建立計畫文件，避免「邊寫邊想」造成日後難以維護。

1. **計畫檔案命名格式**：`YYYY-MM-DD-<feature-name>.md`，例如 `2026-05-12-question-generator.md`。
2. **存放位置**：開發中 → `docs/plans/`；完成後 → `docs/plans/archive/`。
3. **計畫文件結構**：
   ```markdown
   # 功能名稱

   ## User Story
   作為 <角色>，我希望 <做什麼>，以便 <得到什麼價值>。

   ## Spec
   - 行為描述
   - 邊界條件
   - UI 細節（含 mockup 或文字描述）
   - 不在範圍內的事（non-goals）

   ## Tasks
   - [ ] Task 1
   - [ ] Task 2
   - [ ] Task 3
   ```
4. **完成後流程**：
   - 將計畫檔 `git mv` 到 `docs/plans/archive/`。
   - 更新 [`docs/FEATURES.md`](./FEATURES.md) 將該功能標記為「✅ 完成」並補上行為描述。
   - 更新 [`docs/CHANGELOG.md`](./CHANGELOG.md) 加入該版本的記錄。

---

## Git 慣例

- 預設分支：`main`（或 `master`，依實際 repo）。
- Commit message 格式建議（type 採 Conventional Commits 風格）：
  - `feat: 新增題目生成器`
  - `fix: 修正計分溢位`
  - `refactor: 抽出 useTimer composable`
  - `docs: 更新 ARCHITECTURE`
  - `chore: 升級 vite 至 8.0.8`
  - `style: prettier`
  - `test: 新增題目產生器測試`
- 避免一個 commit 包含多個無關變更。
- 不要 commit `node_modules/`、`dist/`、`.env*`、`.eslintcache`（皆已列入 `.gitignore`）。

---

## 不要做的事

- 不要編輯 `pnpm-lock.yaml` — 透過 `pnpm add` / `pnpm remove` 自動維護。
- 不要在 `<script setup>` 外寫 `export default { ... }` 混搭 Options API（除非整檔統一）。
- 不要在 router 之外手動操作 `window.history`。
- 不要在 component 內直接讀寫其他 component 的 state；共用狀態統一放 Pinia store。
- 不要為了避開 `noUncheckedIndexedAccess` 用 `as` 強轉 — 用 `?.`、預設值，或先檢查存在。
