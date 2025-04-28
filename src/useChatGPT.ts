import { OpenAI } from "openai";
import type { Character, Message, LLMProvider } from "@/types";
import { useConversation } from "@/useConversation";
import { getEnvVariable, getProviderConfig } from "@/useEnv";

const openaiConfig = getProviderConfig("chatgpt");
const openai = new OpenAI({
	apiKey: openaiConfig.apiKey,
});

/**
 * ChatGPT用のフック
 * @param model - 使用するモデル名（省略時は環境変数から取得）
 * @param temperature - 温度パラメータ（省略時は環境変数から取得）
 * @returns ChatGPTのLLMプロバイダインターフェース
 */
export function useChatGPT(
	model: string = getEnvVariable("OPENAI_MODEL"),
	temperature: number = getEnvVariable("TEMPERATURE")
): LLMProvider {
	const conversation = useConversation();

	const sendMessage: LLMProvider['sendMessage'] = async (
		character,
		messages,
		maxTurns = getEnvVariable("MAX_TURNS")
	): Promise<Message | null> => {
		try {
			// システムプロンプトを生成
			const systemPrompt = conversation.generateSystemPrompt(character, maxTurns);

			// 会話にシステムプロンプトを追加
			const apiMessages = [
				{ role: "system", content: systemPrompt },
				...messages,
			];

			// OpenAI API呼び出し
			const response = await openai.chat.completions.create({
				model: model,
				messages: apiMessages.map(msg => ({
					role: msg.role as Message["role"],
					content: msg.content
				})),
				temperature: temperature,
				max_tokens: getEnvVariable("MAX_RESPONSE_LENGTH"),
			});

			const assistantReply = response.choices[0].message.content ?? "";

			// 空の応答でないか確認
			if (!assistantReply || assistantReply.length < 2) {
				console.warn(`Warning: ${character.name} generated an empty or short response.`);
				return null;
			}

			// 応答メッセージを作成
			return {
				role: "assistant",
				speaker: character.name,
				content: assistantReply
			};
		} catch (error) {
			console.error(`Error generating response for ${character.name}:`, error);
			return null;
		}
	};

	// LLMプロバイダインターフェースを返す
	return { sendMessage };
}
