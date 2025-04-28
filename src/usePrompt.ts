import { type ProviderType } from '@/types';
import { getDefaultValue, getEnvVariable } from '@/useEnv';

/**
 * ユーザーからの入力を対話式で取得するためのカスタムフック
 */

/**
 * 対話形式でユーザーから入力を取得する
 * @param message - 表示するメッセージ
 * @param defaultValue - デフォルト値（何も入力せずEnterを押した場合）
 * @returns ユーザーの入力値
 */
export async function promptUser(message: string, defaultValue?: string): Promise<string> {
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
export async function selectProvider(): Promise<ProviderType> {
	console.log('使用するAIプロバイダを選択してください:');
	console.log('1. Gemini');
	console.log('2. ChatGPT');

	const defaultProvider = getDefaultValue("PROVIDER") as ProviderType;
	const defaultOption = defaultProvider === 'gemini' ? '1' : '2';

	let selection = await promptUser('番号を入力', defaultOption);

	while (selection !== '1' && selection !== '2') {
		console.log('無効な選択です。1か2を入力してください。');
		selection = await promptUser('番号を入力', defaultOption);
	}

	return selection === '1' ? 'gemini' : 'chatgpt';
}

/**
 * 対話形式でターン数を選択する
 * @returns 選択されたターン数
 */
export async function selectTurns(): Promise<number> {
	const defaultTurns = getDefaultValue("MAX_TURNS").toString();
	const turnsInput = await promptUser('会話のターン数を入力してください', defaultTurns);

	const turns = parseInt(turnsInput, 10);
	if (isNaN(turns) || turns < 1) {
		console.log('無効なターン数です。1以上の数値を入力してください。');
		return selectTurns();
	}

	return turns;
}

/**
 * 対話形式で会話プロンプトを取得する
 * @param argPrompt - コマンドライン引数で指定されたプロンプト（オプション）
 * @returns 会話の開始プロンプト
 */
export async function getConversationPrompt(argPrompt?: string): Promise<string> {
	if (argPrompt) {
		console.log(`プロンプトが引数で指定されました: ${argPrompt}`);
		return argPrompt;
	}

	const defaultPrompt = getEnvVariable("DEFAULT_PROMPT");
	return await promptUser('会話の開始プロンプトを入力してください', defaultPrompt);
}

/**
 * すべての会話設定を対話形式で取得する
 * @param args - コマンドライン引数
 * @returns 会話設定オブジェクト
 */
export async function getConversationSettings(args: string[] = []): Promise<{
	providerType: ProviderType;
	prompt: string;
	turns: number;
}> {
	// プロバイダを対話形式で選択
	const providerType = await selectProvider();
	console.log(`選択されたプロバイダ: ${providerType}`);

	// プロンプトの取得
	const prompt = await getConversationPrompt(args[0]);

	// ターン数を対話形式で選択
	const turns = await selectTurns();

	return {
		providerType,
		prompt,
		turns
	};
}
