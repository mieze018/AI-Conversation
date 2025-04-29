import { createStore } from 'zustand/vanilla';
import { config } from 'dotenv';
import type { AppStore, ProviderType, LLMProvider } from '@/types';

// 環境変数をロード
config();

const defaultInstructions = `
# 発言の特徴: 
- キャラクターの個性や口調を一貫して維持してください
- キャラクターらしい反応や感情を表現してください
- 最初のシステムプロンプトを軸に会話してください。
- 他のキャラクターの発言内容に着想を得て会話を発展させてください
# 避けるべきこと: 
- 長すぎる説明や独白
- 会話の流れを無視した唐突な話題転換
- 「私は～です」という自己紹介的な発言の繰り返し
- 同じ発言の繰り返し
- 相手の発言のおうむ返し
`;

/**
 * ダミーのLLMプロバイダー（初期値用）
 * 実際には使われず、必ず上書きされる
 */
const dummyProvider: LLMProvider = {
	sendMessage: async () => {
		console.error('Provider has not been initialized yet');
		return null;
	}
};

/**
 * アプリケーションストア
 */
export const appStore = createStore<AppStore>()((set, get) => ({
	// 環境変数をストアに設定
	openaiApiKey: (process.env.OPENAI_API_KEY || '').toString(),
	openaiModel: (process.env.OPENAI_MODEL || '').toString(),
	geminiApiKey: (process.env.GEMINI_API_KEY || '').toString(),
	geminiModel: (process.env.GEMINI_MODEL || '').toString(),

	providerType: (process.env.DEFAULT_PROVIDER || 'gemini').toString() as ProviderType,
	prompt: (process.env.DEFAULT_PROMPT || '').toString(),
	turns: 5,
	customInstructions: (process.env.CUSTOM_INSTRUCTIONS || defaultInstructions).toString(),
	temperature: Number(process.env.TEMPERATURE || '0.7'),
	maxResponseLength: Number(process.env.MAX_RESPONSE_LENGTH || '300'),
	history: [],
	provider: dummyProvider, // 初期値はダミープロバイダー
}));

export const useStore = {
	get: appStore.getState,
	set: appStore.setState,
	subscribe: appStore.subscribe,
}
