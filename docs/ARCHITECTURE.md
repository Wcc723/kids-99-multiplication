# ARCHITECTURE

本文件描述 **目前實際存在** 的程式結構與設定。專案處於樣板初始狀態，本文件會隨遊戲功能實作而擴充。

---

## 目錄結構

```
2026-child-99-multiplication/
├── index.html              # SPA 入口；引用 /src/main.ts
├── public/                 # Vite 公開資源（直接複製到 dist 根目錄）
├── src/
│   ├── App.vue             # 根元件；目前只有樣板內容（"You did it!"）
│   ├── main.ts             # Vue 應用啟動入口；註冊 Pinia 與 Router 後 mount('#app')
│   ├── router/
│   │   └── index.ts        # Vue Router 設定；目前 routes 陣列為空
│   └── stores/
│       └── counter.ts      # Pinia 範例 store（counter / doubleCount / increment）
├── env.d.ts                # Vite 環境型別宣告
├── eslint.config.ts        # ESLint flat config；整合 oxlint + Vue + TS + Prettier
├── .oxlintrc.json          # oxlint 規則設定（高速 linter）
├── .prettierrc.json        # Prettier 設定
├── .editorconfig           # 編輯器 newline / indent 統一設定
├── vite.config.ts          # Vite 設定（plugin + alias）
├── tsconfig.json           # TS 根設定；reference 到 app / node 子設定
├── tsconfig.app.json       # App 端 TS（含 src）
├── tsconfig.node.json      # Node 端 TS（含 vite.config.ts 等）
├── package.json            # scripts / 相依套件 / Node engines 版本
└── pnpm-lock.yaml          # pnpm lockfile（真實來源）
```

> 目前 `src/` 內 **沒有** `components/`、`views/`、`assets/`、`composables/`、`__tests__/` 等資料夾，需待功能開發時新增。

---

## 啟動流程（執行時）

```
瀏覽器載入 index.html
        │
        ▼
  <script type="module" src="/src/main.ts">
        │
        ▼
  main.ts:
    createApp(App)
      .use(createPinia())   ← 狀態管理註冊
      .use(router)          ← 路由註冊（目前 routes 為空）
      .mount('#app')        ← 掛載到 index.html 的 <div id="app">
        │
        ▼
  App.vue 渲染（目前只顯示樣板文字）
```

關鍵檔案：
- `index.html`：必須包含 `<div id="app">` 與 `<script type="module" src="/src/main.ts">`。
- `src/main.ts`：`createApp` → `use(createPinia())` → `use(router)` → `mount('#app')`，順序固定。
- `src/router/index.ts`：使用 `createWebHistory(import.meta.env.BASE_URL)`，配合 Vite 的 `BASE_URL` 機制（部署到子路徑時需透過 `vite.config.ts` 的 `base` 設定）。

---

## 啟動流程（建置時）

`pnpm build` 會以 `npm-run-all2`（`run-p`）**平行** 執行：

1. `type-check`：`vue-tsc --build` — 依 `tsconfig.json` 的 references（`tsconfig.app.json` + `tsconfig.node.json`）做增量型別檢查；`.tsbuildinfo` 寫入 `node_modules/.tmp/`，不污染根目錄。
2. `build-only`：`vite build` — Vite 打包輸出至 `dist/`。

兩者平行，型別錯誤不會阻擋 Vite 產出（但 CI 應檢查兩者 exit code）。

---

## Vite 設定（`vite.config.ts`）

```ts
plugins: [
  vue(),           // @vitejs/plugin-vue — 處理 .vue SFC
  vueDevTools(),   // vite-plugin-vue-devtools — dev mode 注入 devtools UI
]
resolve.alias: {
  '@': fileURLToPath(new URL('./src', import.meta.url))   // '@' → 專案內 src/
}
```

- 路徑別名 `@` 同時在 `tsconfig.app.json` 的 `compilerOptions.paths` 對應 `./src/*`，確保 TS 與 Vite 解析一致。
- 沒有設定 `base`，預設部署於根路徑 `/`。

---

## TypeScript 設定要點

- `tsconfig.app.json` extends `@vue/tsconfig/tsconfig.dom.json`，覆蓋：
  - `noUncheckedIndexedAccess: true` — 陣列／物件動態存取會回傳 `T | undefined`，需顯式處理。
  - `paths: { "@/*": ["./src/*"] }` — IDE / vue-tsc 解析別名。
  - `tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo"` — 增量資訊集中存放。
- `include`：`env.d.ts`、`src/**/*`、`src/**/*.vue`。
- `exclude`：`src/**/__tests__/*`（已預留測試目錄排除，但目前未設定測試框架）。
- `tsconfig.node.json` 處理 `vite.config.ts`、`eslint.config.ts` 這類 Node 環境的設定檔。

---

## Lint / Format 設定關係

```
.editorconfig    ← 編輯器層級（縮排、newline、charset）
        │
        ▼
.prettierrc.json ← Prettier 格式化規則
        │
        ▼
.oxlintrc.json   ← oxlint 規則（高速、執行先）
        │
        ▼
eslint.config.ts ← ESLint flat config
   組合：
     - app/files-to-lint（**/*.{vue,ts,mts,tsx}）
     - 忽略 dist / dist-ssr / coverage
     - pluginVue.configs['flat/essential']
     - vueTsConfigs.recommended
     - pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json')   ← oxlint 已覆蓋的規則於 ESLint 關閉
     - skipFormatting（eslint-config-prettier/flat）            ← 關閉與 Prettier 衝突的格式規則
```

`pnpm lint` 會先跑 `oxlint --fix`，再跑 `eslint --fix --cache`（cache 寫到 `.eslintcache`，已列入 `.gitignore`）。

---

## 狀態管理（Pinia）

- 在 `main.ts` 全域註冊：`app.use(createPinia())`。
- 範例 store：`src/stores/counter.ts` 使用 setup-style 寫法（`defineStore('counter', () => { ... })`）。
- 後續新增 store 統一放於 `src/stores/`，每個檔案匯出一個 `useXxxStore`。

---

## 路由（Vue Router）

- 模式：`createWebHistory(import.meta.env.BASE_URL)` — HTML5 history 模式，部署需後端對 SPA 做 fallback。
- 目前 `routes: []`，尚無頁面。
- 未來新增頁面建議於 `src/views/` 建立 `*.vue`，並 lazy import 至 `routes`。

---

## 靜態資源

- `public/`：原樣複製到 `dist/` 根目錄，適合 favicon、機器人檔等不需經 build 處理的檔。
- `src/assets/`（尚未建立）：經 Vite 處理的資源（圖、字型、CSS），建議未來加入此目錄。

---

## 預期擴充方向

> 以下為**尚未實作**的方向，僅作為導引：

- `src/components/`：可重用的 UI 元件（按鈕、題目卡片、計分板等）。
- `src/views/`：頁面層級元件（首頁、遊戲頁、結算頁等）。
- `src/composables/`：可重用的 Composition API logic（例如 `useTimer`、`useScore`）。
- `src/assets/`：圖片、音效、字型。
- `src/stores/`：實際的遊戲狀態 store（題目、分數、設定）。
