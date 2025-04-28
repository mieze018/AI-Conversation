import type { Character, Message, LLMProvider } from './types';
import { useConversation } from './useConversation';
import { GoogleGenAI } from '@google/genai';
import { getEnvVariable, getProviderConfig } from './useEnv';

// Gemini API の設定を取得
const geminiConfig = getProviderConfig("gemini");

// Gemini API クライアントを初期化 
const genAI = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
if (!genAI) {
	console.error("Gemini API client initialization failed.");
	throw new Error("Gemini API client initialization failed.");
}

/**
 * Gemini APIを使用してコンテンツを生成
 * @param contents - コンテンツの内容
 * @param model - 使用するモデル名
 * @param temperature - 温度パラメータ
 * @returns 生成されたコンテンツ
 */
const generateContent = async (
	contents: string,
	model: string = geminiConfig.model,
	temperature: number = getEnvVariable("TEMPERATURE")
) => {
	const response = await genAI.models.generateContentStream({
		model: model,
		contents: contents,
		config: {
			temperature: temperature,
		}
	});
	const result: string[] = [];
	for await (const chunk of response) {
		result.push(chunk.text || "");
	}
	return { response: result.join('') };
}

/**
 * Gemini用のフック
 * @param model - 使用するモデル名（省略時は環境変数から取得）
 * @param temperature - 温度パラメータ（省略時は環境変数から取得）
 * @returns GeminiのLLMプロバイダインターフェース
 */
export function useGemini(
	model: string = getEnvVariable("GEMINI_MODEL"),
	temperature: number = getEnvVariable("TEMPERATURE")
): LLMProvider {
	const conversation = useConversation();

	/**
	 * メッセージを送信してGeminiからの応答を取得
	 */
	const sendMessage: LLMProvider['sendMessage'] = async (
		character,
		messages,
		maxTurns
	): Promise<Message | null> => {
		try {
			// システムプロンプトを生成
			const systemPrompt = conversation.generateSystemPrompt(character, maxTurns);

			// プロンプトを構築
			const prompt = `${systemPrompt}
- これまでの会話は以下の通りです:
${messages.map(msg => `${msg.speaker || msg.role}: ${msg.content}`).join('\n')}
`;
			// Gemini API を呼び出し
			const result = await generateContent(prompt, model, temperature);
			const text = result.response.trim();

			// 生成されたテキストから発言内容を抽出（形式をある程度強制する）
			const match = text.match(/^[^:]+:\s*(.*)/s); // 「発言者: 」以降を抽出
			const responseText = match ? match[1].trim() : text.trim(); // マッチしなければ生成されたテキスト全体を使用

			// 空の発言や無効な発言でないかチェック
			if (!responseText || responseText.length < 2) {
				console.warn(`Warning: Agent ${character.name} generated empty or short response.`);
				return null; // 無効な発言として扱う
			}

			// 応答メッセージを作成
			return {
				role: "assistant",
				speaker: character.name,
				content: responseText
			};

		} catch (error) {
			console.error(`Error generating response for ${character.name}:`, error);
			return null;
		}
	};

	// LLMプロバイダインターフェースを返す
	return { sendMessage };
}
