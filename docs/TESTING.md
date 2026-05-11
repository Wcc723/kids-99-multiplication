# TESTING

> ⚠️ **目前狀態：尚未設定任何測試框架。**
>
> `package.json` 不包含 Vitest、Jest、Playwright、Cypress 或其他測試相關套件；專案中也沒有 `__tests__/`、`tests/`、`*.spec.ts`、`*.test.ts` 等檔案。
> `tsconfig.app.json` 的 `exclude` 已預留 `src/**/__tests__/*`，待設定測試框架時可直接使用。

---

## 未來建議的測試方向

當開始實作遊戲功能時，建議引入以下測試層級（屆時請更新本文件並補上實際指令）：

| 測試層級 | 建議工具 | 目標 |
|----------|----------|------|
| 單元測試 | [Vitest](https://vitest.dev/)（與 Vite 共享設定） | 純函式：題目產生、計分公式、composables |
| 元件測試 | [Vue Test Utils](https://test-utils.vuejs.org/) + Vitest | 單一 Vue 元件的渲染與事件 |
| E2E 測試 | [Playwright](https://playwright.dev/) 或 [Cypress](https://www.cypress.io/) | 完整遊戲流程（開始 → 答題 → 結算） |

---

## 引入 Vitest 的最小步驟（參考用）

> 待實作時請參照官方文件最新指令；以下僅為大致流程。

1. 安裝：`pnpm add -D vitest @vue/test-utils jsdom`。
2. 於 `vite.config.ts` 補上 `test` 區塊（或新增 `vitest.config.ts`），設定 `environment: 'jsdom'`、`globals: true`。
3. 於 `package.json` 的 `scripts` 加入：
   - `"test": "vitest"`
   - `"test:run": "vitest run"`（CI 用，跑完就退出）
4. 建立 `src/**/__tests__/Xxx.spec.ts`（或 `*.test.ts`），開始撰寫測試。
5. 更新本文件：把「目前狀態」改為「已啟用 Vitest」，並補上：
   - 測試檔案表
   - 執行順序與依賴關係
   - 共用 fixtures / helpers 說明
   - 撰寫新測試的步驟
   - 常見陷阱

---

## 常見陷阱（待累積）

> 本區用來記錄實際遇到並解決的問題（例如：Pinia 在測試中需手動 `createPinia()`、jsdom 對 ResizeObserver 的 polyfill 等）。目前尚無內容。
