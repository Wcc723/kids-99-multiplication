#!/usr/bin/env bash
# PostToolUse hook：編輯後對 src/ 與 docs/ 內的檔案自動跑 Prettier。
# 失敗時靜默退出（exit 0），避免阻擋工具流。

set -u

INPUT="$(cat)"

if command -v jq >/dev/null 2>&1; then
  FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')"
else
  FILE_PATH="$(printf '%s' "$INPUT" \
    | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]+"' \
    | head -1 \
    | sed -E 's/.*"file_path"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"
fi

[ -z "${FILE_PATH:-}" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# 只處理 Prettier 認得的格式
case "$FILE_PATH" in
  *.vue|*.ts|*.mts|*.tsx|*.js|*.mjs|*.cjs|*.json|*.jsonc|*.css|*.scss|*.html|*.md|*.yml|*.yaml) ;;
  *) exit 0 ;;
esac

# 找專案根目錄（hook 檔位於 <root>/.claude/hooks/）
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$HOOK_DIR/../.." && pwd)"

# 只處理 src/ 與 docs/ 內的檔（與 package.json 的 `format` 範圍對齊）
case "$FILE_PATH" in
  "$PROJECT_ROOT"/src/*) ;;
  "$PROJECT_ROOT"/docs/*) ;;
  *) exit 0 ;;
esac

cd "$PROJECT_ROOT" || exit 0

if command -v pnpm >/dev/null 2>&1; then
  pnpm exec prettier --write "$FILE_PATH" >/dev/null 2>&1 || true
elif command -v npx >/dev/null 2>&1; then
  npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1 || true
fi

exit 0
