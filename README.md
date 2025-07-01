[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/texmeijin-manalinkmcp-badge.png)](https://mseep.ai/app/texmeijin-manalinkmcp)

# マナリンクMCPサーバー

マナリンクのModel Context Protocol (MCP) サーバー実装です。AIアシスタントが先生検索などの機能を利用できるようにします。

## 機能

このMCPサーバーは以下のツールを提供します：

1. **科目マスタ取得**: 科目名と科目IDのマスタを取得
2. **特徴マスタ取得**: コース特徴のマスタを取得（APIから動的に取得）
3. **学年マスタ取得**: 学年名とIDのマスタを取得
4. **先生検索（詳細指定）**: 科目ID、学年IDなどの詳細パラメータで先生を検索

## 前提条件

- Node.js 18+
- npm または yarn

## インストール

```bash
# リポジトリのクローン
git clone [リポジトリURL]
cd manalink-mcp

# 依存関係のインストール
npm install
```

## 使い方

### 開発モード

```bash
npm run dev
```

### 本番モード

```bash
npm run build
npm start
```

## Claude for Desktopとの連携

Claude for Desktopで使用するには、`claude_desktop_config.json` ファイルに設定を追加します。

1. Claude for Desktopの設定ファイルを開く
```
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. 以下の設定を追加
```json
{
    "mcpServers": {
        "manalink": {
            "command": "node",
            "args": [
                "/絶対パス/manalink-mcp/dist/index.js"
            ]
        }
    }
}
```

3. Claude for Desktopを再起動

## MCP ツール

### 1. 科目マスタ取得

```javascript
// ツール名: get_subject_master
// パラメータ: なし
```

### 2. 特徴マスタ取得

```javascript
// ツール名: get_course_features
// パラメータ: なし
```

### 3. 学年マスタ取得

```javascript
// ツール名: get_grade_master
// パラメータ: なし
```

### 4. 先生検索 (詳細指定)

```javascript
// ツール名: search_teachers_advanced
// パラメータ:
// - subject_ids: 科目IDの配列（オプション）
// - grade_ids: 学年IDの配列（オプション）
// - course_feature_id: 特徴ID（オプション）
// - sort: ソート順（オプション）[pr, certification, rating, lesson_count, latest]
// - desired_teaching_period: 指導期間（オプション）[monthly, once]
```

## 検証方法

MCP Inspectorを使用して検証することができます。

1. ビルドを実行してから、インスペクタを実行します
```bash
npm run build
npx @modelcontextprotocol/inspector node dist/index.js
```

## ライセンス

MIT

## HTMLからMarkdownへの変換機能

マナリンクから取得したHTMLコンテンツをマークダウン形式に変換する機能を実装しています。

### インストール方法

```bash
npm install node-html-markdown
```

### 使用方法

```typescript
import { convertHtmlToMarkdown } from './utils/api';

// HTMLからMarkdownへの変換
const html = `
  <div>
    <h1>マナリンク</h1>
    <p>オンライン家庭教師プラットフォーム</p>
    <ul>
      <li><a href="/about">サービスについて</a></li>
      <li><a href="/teachers">先生を探す</a></li>
    </ul>
  </div>
`;

const markdown = convertHtmlToMarkdown(html);
console.log(markdown);
```

### 変換結果

上記のHTMLからは以下のようなマークダウンが生成されます：

```markdown
# マナリンク

オンライン家庭教師プラットフォーム

* [サービスについて](/about)
* [先生を探す](/teachers)
```

### 先生検索結果のマークダウン変換

先生検索APIでは、検索結果をHTML形式とMarkdown形式の両方で取得できます：

```typescript
import { searchTeachers } from './utils/api';

// 数学の中学生を教えられる先生を検索
const result = await searchTeachers({
  subject_ids: [2], // 数学
  grade_ids: [4], // 中学1年生
  sort: 'rating'
});

// HTML形式の検索結果
console.log(result.bodyContent);

// Markdown形式の検索結果
console.log(result.markdown);
```