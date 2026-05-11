---
---

# Git Commit 規則

## 格式
採用 Conventional Commits 風格：

```
<type>: <簡潔描述（祈使句、現在式、不加句號）>

[可選 body：說明動機與差異]
[可選 footer：BREAKING CHANGE: ... / Refs: #issue]
```

## type 類型
| type | 用途 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修正 bug |
| `refactor` | 重構（不改變外部行為） |
| `perf` | 效能優化 |
| `docs` | 僅文件變更（README、docs/、CLAUDE.md） |
| `style` | 純格式（空白、分號、Prettier 結果），不影響邏輯 |
| `test` | 新增或修正測試 |
| `chore` | 建置流程、相依套件升級、設定變更 |
| `ci` | CI / CD 設定 |
| `revert` | 還原先前 commit |

## 範例
- `feat: 新增題目生成器`
- `fix: 修正計分溢位`
- `refactor: 抽出 useTimer composable`
- `docs: 更新 ARCHITECTURE 啟動流程圖`
- `chore: 升級 vite 至 8.0.8`

## 撰寫原則
- subject 行 ≤ 72 字元，敘述為祈使句（「新增」「修正」「重構」），不要過去式。
- 一個 commit 一件事；無關變更應拆開（功能 + 格式 + 升級套件分開 commit）。
- body 解釋「為什麼這樣改」而非「改了什麼」（diff 已說明改了什麼）。

## 禁止 commit 的檔案
- `node_modules/` — 已列入 `.gitignore`。
- `dist/` / `dist-ssr/` — 已列入 `.gitignore`。
- `.env` 與任何 `*.local` — 已列入 `.gitignore`。
- `.eslintcache` — 已列入 `.gitignore`。
- `*.log` — 已列入 `.gitignore`。
- `.DS_Store` — 已列入 `.gitignore`。
- 個人 IDE 設定（除 `.vscode/extensions.json` 外，`.vscode/*` 已被 `.gitignore`）。

## 不要做
- 不要強制 push 到 main / master（`git push --force`）。
- 不要 amend 已 push 出去的 commit；改用新 commit。
- 不要在 commit message 帶入無關內容（廣告、長串 ASCII、私人字串）。
- 不要使用 `git reset --hard` 抹掉同事的提交。
