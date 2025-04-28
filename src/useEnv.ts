import { config } from "dotenv";

config();

// 環境変数の型定義
interface EnvVariables {
	// OpenAI API設定
	OPENAI_API_KEY: string;
	OPENAI_MODEL: string;

	// Google Gemini API設定
	GEMINI_API_KEY: string;
	GEMINI_MODEL: string;

	// アプリケーション設定
	DEFAULT_PROVIDER: "gemini" | "chatgpt";

	// 個人設定
	MAX_TURNS: number;
	DEFAULT_PROMPT: string;
	TEMPERATURE: number;
	MAX_RESPONSE_LENGTH: number;
	CUSTOM_INSTRUCTIONS: string;
}

// 環境変数のデフォルト値
const defaultEnvValues: Partial<EnvVariables> = {
	OPENAI_MODEL: "gpt-4o",
	GEMINI_MODEL: "gemini-2.0-flash",
	DEFAULT_PROVIDER: "gemini",
	MAX_TURNS: 5,
	DEFAULT_PROMPT: "",
	TEMPERATURE: 0.7,
	MAX_RESPONSE_LENGTH: 300,
	CUSTOM_INSTRUCTIONS: ""
};

// 環境変数を取得する関数
export function getEnvVariable<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
	const value = process.env[key];

	// 数値型の場合は変換
	if (["MAX_TURNS", "TEMPERATURE", "MAX_RESPONSE_LENGTH"].includes(key)) {
		return (value ? Number(value) : defaultEnvValues[key]) as EnvVariables[K];
	}

	// 文字列型の場合
	return (value || defaultEnvValues[key]) as EnvVariables[K];
}

// すべての環境変数を取得
export function getAllEnvVariables(): EnvVariables {
	return {
		OPENAI_API_KEY: getEnvVariable("OPENAI_API_KEY"),
		OPENAI_MODEL: getEnvVariable("OPENAI_MODEL"),
		GEMINI_API_KEY: getEnvVariable("GEMINI_API_KEY"),
		GEMINI_MODEL: getEnvVariable("GEMINI_MODEL"),
		DEFAULT_PROVIDER: getEnvVariable("DEFAULT_PROVIDER"),
		MAX_TURNS: getEnvVariable("MAX_TURNS"),
		DEFAULT_PROMPT: getEnvVariable("DEFAULT_PROMPT"),
		TEMPERATURE: getEnvVariable("TEMPERATURE"),
		MAX_RESPONSE_LENGTH: getEnvVariable("MAX_RESPONSE_LENGTH"),
		CUSTOM_INSTRUCTIONS: getEnvVariable("CUSTOM_INSTRUCTIONS"),
	};
}

// 特定のプロバイダーの設定を取得
export function getProviderConfig(provider: "chatgpt" | "gemini" = getEnvVariable("DEFAULT_PROVIDER")) {
	const config = {
		chatgpt: {
			apiKey: getEnvVariable("OPENAI_API_KEY"),
			model: getEnvVariable("OPENAI_MODEL"),
		},
		gemini: {
			apiKey: getEnvVariable("GEMINI_API_KEY"),
			model: getEnvVariable("GEMINI_MODEL"),
		},
	};

	return config[provider];
}

