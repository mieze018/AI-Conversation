import { useStore } from '@/store';
import { characters, characterNames, characterIds } from '@/utils/characters';
import { saveConversationToFile } from '@/utils/saveConversationToFile';

import type { Character, Message } from '@/types';

/**
 * 会話履歴を管理
 */
export function useConversation() {
	const { turns, maxResponseLength, customInstructions, prompt, provider, history } = useStore.get();
	const turnDelayMs = 1000;
	const getHistory = () => useStore.get().history;
	const clearHistory = () => useStore.set({ history: [] });

	// 常に最新の履歴を取得してから更新するように修正
	const addMessage = (message: Message) => {
		const currentHistory = getHistory();
		useStore.set({ history: [...currentHistory, message] });
	};

	/**
	 * キャラクター用のシステムプロンプトを生成
	 * @param character - キャラクター情報
	 */
	const generateCharacterPrompt = (character: Character,): string => {
		return `
	- あなたは「${character.name}」というキャラクターです。会話の続きを自然な日本語で発言してください。
	- 会話の参加メンバーは${characterNames.join('、')}です。
	- あなたの設定: ${character.persona}
	 あなたの役割: 会話の流れを考慮して、前の発言に自然に反応してください。会話がスムーズに進むように心がけてください。
	- 一度の発言は、${maxResponseLength}文字以内に収めてください。
	${customInstructions}
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

			console.info(`\n<div class="${speakerKey}" count="${index + 1}">`);
			console.info(`${message.speaker}: ${message.content}`);
			console.info(`</div>`);
		} else {
			console.info(`${message.role}: ${message.content}`);
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
	 * キャラクター同士の会話シミュレーションを実行する
	 */
	const runConversation = async (): Promise<Message[]> => {
		console.info("--- 会話シミュレーション開始 ---");

		for (let i = 0; i < turns; i++) {
			// 次に話すキャラクターを選択
			const currentSpeakerKey = characterIds[i % characterIds.length];
			const currentSpeaker = characters[currentSpeakerKey];

			if (!currentSpeaker) {
				console.error(`Error: Character not found for key ${currentSpeakerKey}`);
				return getHistory();
			}

			// キャラクターに発言させる
			const newMessage = await provider.sendMessage(currentSpeaker);

			if (newMessage) {
				addMessage(newMessage);
				printMessage(newMessage, i);
			} else {
				console.warn(`Warning: ${currentSpeaker.name} generated an invalid response.`);
				// 会話を中断する
				return getHistory();
			}

			// 次のターンの前に待機
			if (i < turns - 1) {
				await wait();
			}
		}

		// 最新の会話履歴を取得してから保存
		const currentHistory = getHistory();
		saveConversationToFile(currentHistory);

		return currentHistory;
	};

	// 初回の場合、初期プロンプトがあれば履歴に追加
	if (!history.length && prompt) {
		addMessage({ role: "system", content: prompt });
	}


	// フックのインターフェースを返す
	return {
		getHistory,
		clearHistory,
		addMessage,
		generateCharacterPrompt,
		printMessage,
		wait,
		saveConversationToFile,
		runConversation
	};
}
