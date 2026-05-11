---
paths:
  - "src/**/*.ts"
  - "src/**/*.vue"
---

# Vue + Pinia + TypeScript 慣例

## Composition API
- 預設 Composition API；不要混用 Options API。
- 可重用邏輯抽到 `src/composables/useXxx.ts`，命名以 `use` 開頭。
- composable 對外暴露的 reactive state 用 `readonly()` 或 `computed()` 包裝，內部以 `ref` / `reactive` 持有。
- 副作用（`onMounted`、`watch`）放在 composable 內，由呼叫方在 setup context 觸發。

## Pinia Store
- 一律使用 **setup-style**（與 `src/stores/counter.ts` 一致）：
  ```ts
  export const useGameStore = defineStore('game', () => {
    const score = ref(0)
    const doubled = computed(() => score.value * 2)
    function add(n: number) { score.value += n }
    return { score, doubled, add }
  })
  ```
- store id 與檔名一致（`'game'` ↔ `game.ts`），不要重複。
- 元件中要解構 store 並保留 reactivity 時，使用 `storeToRefs(store)`，方法直接從 store 取。
- 不要從元件直接 mutate 其他元件的 ref；共用狀態統一進 store。

## TypeScript 嚴格度
- 不使用 `any`；遇到第三方未型別化時用 `unknown` + type guard。
- 不用 `as Foo` 強轉繞過型別錯誤；改用 type guard、`satisfies`、或修正型別。
- `noUncheckedIndexedAccess` 已啟用：
  - `arr[i]` 型別為 `T | undefined`，必須用 `?.` 或先檢查存在。
  - `obj[key]` 同理；避免直接 `obj[key].foo` 不檢查。
- 偏好 `interface` 用於物件契約、`type` 用於 union / utility。
- 函式參數與回傳值至少標一邊型別，讓 inference 能往下傳遞。

## Reactive Best Practices
- 不要把整顆物件塞進 `ref()` 又拿 `.value.x = ...` 改子屬性；用 `reactive()` 較自然，或拆成多個 `ref`。
- 解構 reactive 物件會喪失 reactivity；改用 `toRefs(obj)` 或不解構。
- `watch` 對複雜物件使用 `deep: true`，但要意識到效能成本。

## 路徑與 Import
- 全部用 `@/...` 別名（對應 `src/`），不要長串 `../../../`。
- 同目錄 / 鄰近檔可用相對路徑。
- 不要從 `src/components/foo/bar.vue` 之類的 deep path import 第三方未公開的內部模組；建立 barrel `index.ts` 維持 API 邊界。
