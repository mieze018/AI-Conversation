import { getConversationSettings } from '@/modules/getSettings';
import { useConversation } from '@/modules/useConversation';
import { useChatGPT } from '@/services/useChatGPT';
import { useGemini } from '@/services/useGemini';
import { useStore } from '@/store';
import { characterNames } from '@/utils/characters';

// メイン処理
async function startConversation() {

	// 対話形式で会話設定を取得（内部でストアに保存される）
	await getConversationSettings();

	// 会話を開始（設定はストアから取得）
	const { providerType, prompt, turns } = useStore.get();

	console.info(`${providerType}を使って会話を開始します。参加者は${characterNames.join('、')}、会話回数は${turns}回です。`);
	console.info(`プロンプト: "${prompt}"`);

	// プロバイダの選択
	if (providerType === 'chatgpt') {
		useStore.set({ provider: useChatGPT() })
	} else {
		useStore.set({ provider: useGemini() })
	}

	// 最初の会話を実行
	const conversation = useConversation();
	// 以降の会話の実行
	await conversation.runConversation();
}

// プログラム実行
startConversation().catch((error) => {
	console.error('エラーが発生しました:', error);
});
