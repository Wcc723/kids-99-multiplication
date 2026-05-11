# FEATURES

功能清單與完成狀態。本文件記錄專案**目前實際存在**的功能；未來規劃的功能應先以 [docs/plans/](./plans/) 計畫文件提出，並在完成後同步更新此處。

---

## 狀態說明

| 標記 | 意義 |
|------|------|
| ✅ | 已完成、可使用 |
| 🚧 | 進行中（對應 `docs/plans/` 有 active 計畫） |
| 📝 | 已規劃但尚未動工 |
| — | 尚未規劃 |

---

## 基礎建設

| 功能 | 狀態 | 說明 |
|------|------|------|
| Vue 3 + TypeScript 樣板 | ✅ | `npm create vue@latest` 樣板已建立 |
| Vite 開發伺服器 | ✅ | `pnpm dev` 啟動，hot-reload 可用 |
| Vue Router 註冊 | ✅ | `src/router/index.ts` 已建立，使用 `createWebHistory`，但 routes 陣列為空 |
| Pinia 註冊 | ✅ | `main.ts` 已 `app.use(createPinia())`；`src/stores/counter.ts` 為範例 store |
| 路徑別名 `@` → `src/` | ✅ | 同時於 `vite.config.ts` 與 `tsconfig.app.json` 設定 |
| ESLint + oxlint | ✅ | `pnpm lint` 跑兩者並自動修復 |
| Prettier 格式化 | ✅ | `pnpm format` 處理 `src/` |
| 型別檢查 | ✅ | `pnpm type-check`（`vue-tsc --build`） |
| 建置流程 | ✅ | `pnpm build` 平行跑 type-check + build-only |
| 測試框架 | — | 尚未設定（見 [TESTING.md](./TESTING.md)） |
| CI / CD | — | 尚未設定 |
| 部署 | — | 尚未設定 |

---

## 遊戲功能

> 目前**完全尚未實作**。`src/App.vue` 僅顯示 "You did it!" 樣板文字；router routes 為空。
> 兒童九九乘法練習遊戲的所有遊戲玩法（題目產生、計分、選關卡、結算等）皆待規劃。

| 功能 | 狀態 | 說明 |
|------|------|------|
| 首頁 / 主選單 | — | 尚未規劃 |
| 九九乘法題目產生器 | — | 尚未規劃 |
| 答題介面 | — | 尚未規劃 |
| 計分與結算 | — | 尚未規劃 |
| 關卡 / 難度設計 | — | 尚未規劃 |
| 練習記錄保存 | — | 尚未規劃（localStorage / IndexedDB / 後端皆未決定） |
| 音效 / 動畫 | — | 尚未規劃 |
| 多人模式或排行榜 | — | 尚未規劃 |

> 開始實作任一遊戲功能前，請先於 `docs/plans/` 建立計畫文件（命名 `YYYY-MM-DD-<feature>.md`），參考 [DEVELOPMENT.md](./DEVELOPMENT.md#計畫歸檔流程)。

---

## 行為描述（待補）

> 此區段用來記錄每個已完成功能的**詳細行為**：
> - 觸發條件與互動流程
> - 邊界條件與錯誤情境
> - 與其他模組的整合方式
> - 非標準機制（例如自訂計分公式、防作弊邏輯等）
>
> 目前無已完成功能可記錄。
