import { useChatGPT } from '@/useChatGPT';
import { useGemini } from '@/useGemini';
import { useConversation } from '@/useConversation';
import { characterNames } from '@/characters';
import type { LLMProvider, ProviderType } from '@/types';
import { getEnvVariable, getAllEnvVariables } from '@/useEnv';

/**
 * 指定したLLMプロバイダで会話シミュレーションを実行
 * @param providerType - 使用するLLMプロバイダの種類
 * @param prompt - 会話の開始プロンプト
 * @param characters - 会話に参加するキャラクター名の配列
 * @param turns - 会話のターン数
 */
async function startConversation(
	{ providerType, prompt, turns }:
		{ providerType: ProviderType; prompt: string; turns: number }
) {
	console.log(`プロバイダ: ${providerType}で会話を開始します。会話回数は${turns}回です。参加者は${characterNames.join('、')}です。`);
	console.log(getAllEnvVariables)
	console.log(`プロンプト: "${prompt}"`);

	// プロバイダの選択
	let provider: LLMProvider;
	if (providerType === 'chatgpt') {
		provider = useChatGPT();
	} else {
		provider = useGemini();
	}

	// 会話フックを使用して会話を実行
	const conversation = useConversation(prompt);
	await conversation.runConversation({ provider, maxTurns: turns });
}

// コマンドライン引数の取得
const args = process.argv.slice(2);
const providerInput = args[0]?.toLowerCase();
const providerArg = (providerInput === 'chatgpt' || providerInput === 'gemini')
	? providerInput
	: getEnvVariable("DEFAULT_PROVIDER");
const promptArg = args[1] || getEnvVariable("DEFAULT_PROMPT");
const turnsArg = parseInt(args[2], 10) || getEnvVariable("MAX_TURNS");

// 会話を開始
startConversation({ providerType: providerArg, prompt: promptArg, turns: turnsArg }).catch((error) => {
	console.error('エラーが発生しました:', error);
});
