# AI会話シミュレーター

複数のAIキャラクターが会話するシミュレーションツールです。

マークダウンファイルでキャラクター設定を定義して、OpenAI API（ChatGPT）またはGoogle Gemini APIを使ってキャラクター同士の会話を生成します。

## 特徴

- 2人以上のキャラクターによる自然な会話シミュレーション
- マークダウンファイルで簡単にキャラクター設定を追加可能
- ChatGPTとGeminiのAPIに対応
- プロンプト、参加キャラクター、会話ターン数などをカスタマイズ可能
- 会話終了時に`dist`ディレクトリにログが保存されます
- 過去の会話の要約を保存し、次回の会話で参照できます

## セットアップ

### 前提条件 / Prerequisites

- [Bun](https://bun.sh/)がインストールされている必要があります
- OpenAI API キーまたは Google Gemini API キーが必要です

### インストール / Installation

1. リポジトリをクローン
2. リポジトリのディレクトリに移動
3. 依存関係のインストール

	```bash
	# Install dependencies
	bun install
	```

### 基本設定

1. `.env.example`をコピーして`.env`に名称変更します。

	```bash
	cp .env.example .env
	```

2. `.env`を編集して、API キーと使用するモデルを設定します：

	```dotenv
	# OpenAI API（ChatGPT用）/ For ChatGPT
	OPENAI_API_KEY=your_openai_api_key_here
	OPENAI_MODEL=gpt-4o

	# Google Gemini API
	GEMINI_API_KEY=your_gemini_api_key_here
	GEMINI_MODEL=gemini-2.0-flash
	```

3. `characters/list.example.js`をコピーして`characters/list.js`に名称変更します。

	```bash
	cp characters/list.example.js characters/list.js
	```

## 使い方

下記のコマンドを実行すると、対話形式でオプションを設定し、会話を開始します。

```bash
bun start
```

### 会話メモリー機能について

このツールには会話の文脈を記憶する「会話メモリー機能」が実装されています。

- 会話が終了すると、AIが自動的に会話内容を要約して保存します
- 次回起動時に過去の会話を参照するかどうか選択できます
- 「はい」を選ぶと、前回の会話の文脈を引き継いで自然な続きの会話が可能です
- 「いいえ」を選ぶと、過去の会話をリセットして新しい会話を始めます

会話メモリーは `dist/memory/conversation_memory.md` に保存されます。

## キャラクターの作成

独自のキャラクターをデフォルトから変更するには、`characters`ディレクトリにマークダウンファイルを作成します。

### キャラクター定義ファイルの構造

`characters/`にMarkdownファイルを作成し、キャラクターファイルを定義します。例: `characters/inu.md`

テンプレート`characters/_template.md`を参考にして内容を記入してください。

### キャラクターの登録

新しいキャラクターを作成したら、`characters/list.js`にキャラクターを登録します：

```javascript
export const charactersList = {
  alien: {
    name: 'ウチュウジン',
  },
  neko: {
    name: 'ねこ',
  },
  // ここから追加部分
  inu: { // ファイル名とをキーとして登録します
    name: 'いぬ', // キャラクターの呼び名
  },
}
```

## カスタマイズ

`.env`ファイルで以下の設定をカスタマイズできます：

| 設定項目 | 説明 |
|---------|------|
| `DEFAULT_PROVIDER` | デフォルトで使用するAIプロバイダー |
| `DEFAULT_PROMPT` | デフォルトのプロンプト |
| `TEMPERATURE` | 生成テキストのランダム性 。<br>創造的な会話: `1.0`〜`1.8`<br>一貫した応答: `0.2`〜`0.8` |
| `MAX_RESPONSE_LENGTH` | 一度の発言の最大文字数。|
| `CUSTOM_INSTRUCTIONS` | 指示をデフォルトから変更する場合に使用します。|
