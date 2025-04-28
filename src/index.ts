import { useChatGPT } from '@/useChatGPT';
import { useGemini } from '@/useGemini';
import { useConversation } from '@/useConversation';
import { characterNames } from '@/characters';
import type { LLMProvider, ProviderType } from '@/types';
import { getConversationSettings } from '@/usePrompt';

/**
 * 指定したLLMプロバイダで会話シミュレーションを実行
 * @param providerType - 使用するLLMプロバイダの種類
 * @param prompt - 会話の開始プロンプト
 * @param turns - 会話のターン数
 */
async function startConversation(
	{ providerType, prompt, turns }:
		{ providerType: ProviderType; prompt: string; turns: number }
) {
	console.log(`${providerType}を使って会話を開始します。会話回数は${turns}回です。参加者は${characterNames.join('、')}です。`);
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

// メイン処理
async function main() {
	// コマンドライン引数を取得
	const args = process.argv.slice(2);

	// 対話形式で会話設定を取得
	const settings = await getConversationSettings(args);

	// 会話を開始
	await startConversation(settings);
}

// プログラム実行
main().catch((error) => {
	console.error('エラーが発生しました:', error);
});
