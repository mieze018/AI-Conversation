export interface Character {
	name: string;
	persona: string; // このキャラクターの性格や口調、背景設定
}

export interface Message {
	role: "system" | "user" | "assistant";
	speaker?: string; // 発言者の名前（キャラクター名など）
	content: string;
}

/**
 * LLMのプロバイダータイプ
 */
export type ProviderType = 'gemini' | 'chatgpt';

/**
 * LLMクライアント用の共通インターフェース
 */
export interface LLMProvider {
	/**
	 * メッセージを送信してLLMからの応答を取得
	 * @param character - 発言するキャラクター
	 * @param messages - 会話履歴
	 * @param maxTurns - 最大ターン数
	 * @returns 生成されたメッセージ
	 */
	sendMessage(
		character: Character,
		messages: Message[],
		maxTurns: number,
	): Promise<Message | null>;
}
