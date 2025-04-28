# AI会話シミュレーター

複数のAIキャラクターが会話するシミュレーションツールです。

マークダウンファイルでキャラクター設定を定義して、OpenAI API（ChatGPT）またはGoogle Gemini APIを使ってキャラクター同士の会話を生成します。

## 特徴

- 2人以上のキャラクターによる自然な会話シミュレーション
- マークダウンファイルで簡単にキャラクター設定を追加可能
- ChatGPTとGeminiのAPIに対応
- プロンプト、参加キャラクター、会話ターン数などをカスタマイズ可能
- 会話終了時に`dist`ディレクトリにログが保存されます

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

## 使い方

### 基本的な実行方法

- `.env` でプロンプトを指定して、LLMプロバイダを選んで実行します

	```dotenv
	DEFAULT_PROMPT=今日の天気について話そう
	```

	```bash
	# Gemini
	bun run start:gemini
	# ChatGPT
	bun run start:chatgpt
	```

- または引数でプロンプトを指定して実行します

	```bash
	# Gemini
	bun run start:gemini "今日の天気について話そう" 
	# ChatGPT
	bun run start:chatgpt "今日の天気について話そう" 
	```

## キャラクターの作成

独自のキャラクターをデフォルトから変更するには、`src/characters`ディレクトリにマークダウンファイルを作成します。

### キャラクター定義ファイルの構造

`characters/`にMarkdownファイルを作成し、キャラクターファイルを定義します。例: `characters/inu.md`

テンプレート`characters/_template.md`を参考にして内容を記入してください。

### キャラクターの登録

新しいキャラクターを作成したら、`characters/_list.js`にキャラクターを登録します：

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

### デフォルト設定の変更

`.env`ファイルで以下の設定をカスタマイズできます：

| 設定項目 | 説明 |
|---------|------|
| `OPENAI_MODEL` | ChatGPT使用時のモデル |
| `GEMINI_MODEL` | Gemini使用時のモデル |
| `DEFAULT_PROVIDER` | デフォルトで使用するAIプロバイダー |
| `MAX_TURNS` | 会話のターン数（往復回数） |
| `TEMPERATURE` | 生成テキストのランダム性 。<br>創造的な会話: `1.0`〜`1.8`<br>一貫した応答: `0.2`〜`0.8` |
| `MAX_RESPONSE_LENGTH` | 一度の発言の最大文字数。|
| `CUSTOM_INSTRUCTIONS` | 指示をデフォルトから変更する場合に使用します。|
