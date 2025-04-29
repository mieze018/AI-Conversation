import { type ProviderType } from '@/types';
import { useStore } from '@/store';

/**
 * 対話形式でユーザーから入力を取得する
 * @param message - 表示するメッセージ
 * @param defaultValue - デフォルト値（何も入力せずEnterを押した場合）
 * @returns ユーザーの入力値
 */
async function promptUser(
	message: string,
	defaultValue?: string
): Promise<string> {
	process.stdout.write(`${message}${defaultValue ? ` (デフォルト: ${defaultValue})` : ''}: `);

	const input = await new Promise<string>(resolve => {
		process.stdin.once('data', data => {
			resolve(data.toString().trim());
		});
	});

	return input || defaultValue || '';
}
/**
 * 対話形式でプロバイダを選択する
 * @returns 選択されたプロバイダタイプ
 */
async function selectProvider(): Promise<ProviderType> {
	console.log('使用するAIプロバイダを選択してください:');
	console.log('1. Gemini');
	console.log('2. ChatGPT');

	const defaultProvider = useStore.get().providerType;
	const defaultOption = defaultProvider === 'gemini' ? '1' : '2';

	let selection = await promptUser('番号を入力', defaultOption);

	while (selection !== '1' && selection !== '2') {
		console.log('無効な選択です。1か2を入力してください。');
		selection = await promptUser('番号を入力', defaultOption);
	}
	const providerType = selection === '1' ? 'gemini' : 'chatgpt';
	return providerType;
}

/**
 * 対話形式でターン数を選択する
 * @returns 選択されたターン数
 */
async function selectTurns(): Promise<number> {
	const defaultTurns = useStore.get().turns;
	const turnsInput = await promptUser('会話のターン数を入力してください', `${defaultTurns}`);

	const turns = parseInt(turnsInput, 10);
	if (isNaN(turns) || turns < 1) {
		console.log('無効なターン数です。1以上の数値を入力してください。');
		return selectTurns();
	}
	return turns;
}

/**
 * 対話形式で会話プロンプトを取得する
 * @returns 会話の開始プロンプト
 */
async function getConversationPrompt(): Promise<string> {
	const defaultPrompt = useStore.get().prompt;
	const prompt = await promptUser('会話の開始プロンプトを入力してください', defaultPrompt);
	return prompt;
}

/**
 * すべての会話設定を対話形式で取得する
 * @param args - コマンドライン引数
 * @returns 会話設定オブジェクト
 */
export async function getConversationSettings(): Promise<void> {
	// プロバイダを対話形式で選択
	const providerType = await selectProvider();

	// プロンプトの取得
	const prompt = await getConversationPrompt();

	// ターン数を対話形式で選択
	const turns = await selectTurns();

	// ストアに保存
	useStore.set({ providerType, prompt, turns });
}
