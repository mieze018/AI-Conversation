import type { Character, Message, LLMProvider } from '@/types';
import { characters, characterNames, characterIds } from '@/characters';
import * as fs from 'fs';
import * as path from 'path';
import { getEnvVariable } from '@/useEnv';

/**
 * 会話履歴を管理
 * @param initialPrompt - 初期プロンプト
 */
export function useConversation(initialPrompt?: string) {
	// 会話履歴の状態
	let history: Message[] = [];
	const turnDelayMs = 3000; // ターン間の待機時間

	/**
	 * 会話履歴を取得
	 */
	const getHistory = () => [...history];

	/**
	 * 会話履歴をクリア
	 */
	const clearHistory = () => {
		history = [];
	};

	/**
	 * 会話履歴にメッセージを追加
	 * @param message - 追加するメッセージ
	 */
	const addMessage = (message: Message) => {
		history.push(message);
	};

	/**
	 * キャラクター用のシステムプロンプトを生成
	 * @param character - キャラクター情報
	 */
	const generateSystemPrompt = (character: Character, maxTurns: number): string => {
		return `
	- あなたは「${character.name}」というキャラクターです。会話の続きを自然な日本語で発言してください。
	- 会話の参加メンバーは${characterNames.join('、')}です。
	- あなたの設定: ${character.persona}
	 あなたの役割: 会話の流れを考慮して、前の発言に自然に反応してください。会話がスムーズに進むように心がけてください。
	- 一度の発言は、${getEnvVariable("MAX_RESPONSE_LENGTH")}文字以内に収めてください。
	${getEnvVariable("CUSTOM_INSTRUCTIONS")}
	`;
	};

	/**
	 * メッセージを標準出力に表示
	 * @param message - 表示するメッセージ
	 * @param index - 会話のインデックス
	 */
	const printMessage = (message: Message, index: number) => {
		if (message.speaker) {
			const speakerKey = Object.keys(characters).find(
				key => characters[key].name === message.speaker
			) || '';

			console.log(`\n<div class="${speakerKey}" count="${index + 1}">`);
			console.log(`${message.speaker}: ${message.content}`);
			console.log(`</div>`);
		} else {
			console.log(`${message.role}: ${message.content}`);
		}
	};

	/**
	 * 指定時間待機する
	 * @param ms - 待機時間（ミリ秒）
	 */
	const wait = async (ms: number = turnDelayMs): Promise<void> => {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	/**
	 * 会話履歴をJSONファイルとして保存
	 */
	const saveConversationToFile = () => {
		try {
			const formattedDate = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
			const fileName = `conversation_${formattedDate}.json`;
			const distDir = path.join(__dirname, '../dist');

			// distディレクトリが存在しない場合は作成
			if (!fs.existsSync(distDir)) {
				fs.mkdirSync(distDir, { recursive: true });
			}

			const filePath = path.join(distDir, fileName);
			fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
			console.log(`Conversation history saved to ${filePath}`);
		} catch (error) {
			console.error('Error writing file:', error);
			console.log(history);
		}
	};

	/**
	 * キャラクター同士の会話シミュレーションを実行する
	 * @param provider - 使用するLLMプロバイダ
	 * @param maxTurns - 最大ターン数
	 * @param firstPrompt - 会話開始時のプロンプト
	 */
	const runConversation = async ({
		provider,
		maxTurns,
	}: {
		provider: LLMProvider,
		maxTurns: number,
	}
	): Promise<Message[]> => {
		console.log("--- 会話シミュレーション開始 ---");

		for (let i = 0; i < maxTurns; i++) {
			// 次に話すキャラクターを選択
			const currentSpeakerKey = characterIds[i % characterIds.length];
			const currentSpeaker = characters[currentSpeakerKey];

			if (!currentSpeaker) {
				console.error(`Error: Character not found for key ${currentSpeakerKey}`);
				return getHistory();
			}

			// キャラクターに発言させる
			const newMessage = await provider.sendMessage(
				currentSpeaker,
				getHistory(),
				maxTurns,
			);

			if (newMessage) {
				addMessage(newMessage);
				printMessage(newMessage, i);
			} else {
				console.warn(`Warning: ${currentSpeaker.name} generated an invalid response.`);
				// 会話を中断する
				return getHistory();
			}

			// 次のターンの前に待機
			if (i < maxTurns - 1) {
				await wait();
			}
		}

		// 会話履歴を保存
		saveConversationToFile();

		return getHistory();
	};

	// 初期プロンプトがあれば履歴に追加
	if (initialPrompt) {
		addMessage({ role: "system", content: initialPrompt });
	}


	// フックのインターフェースを返す
	return {
		getHistory,
		clearHistory,
		addMessage,
		generateSystemPrompt,
		printMessage,
		wait,
		saveConversationToFile,
		runConversation
	};
}
