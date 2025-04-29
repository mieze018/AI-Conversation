import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useConversation } from '@/modules/useConversation';
import * as SaveConversationModule from '@/utils/saveConversationToFile';
import { useStore } from '@/store';
import type { Message } from '@/types';

// テスト用のモックストア
const mockHistoryData: Message[] = [];

// モックストア
const mockStore = {
	history: mockHistoryData,
	turns: 2,
	maxResponseLength: 300,
	customInstructions: 'テスト用指示',
	prompt: '',
	provider: {
		sendMessage: vi.fn()
	}
};

// モックの設定
beforeEach(() => {
	// 履歴をクリア
	mockHistoryData.length = 0;

	// sendMessageのモック実装
	mockStore.provider.sendMessage.mockImplementation(async (character) => ({
		role: 'assistant',
		speaker: character.name,
		content: `${character.name}の発言テスト`
	}));

	// saveConversationToFileのモック
	vi.spyOn(SaveConversationModule, 'saveConversationToFile').mockImplementation((history) => {
		console.log('モック saveConversationToFile が呼ばれました', history);
		return undefined;
	});

	// useStore.getのモック
	vi.spyOn(useStore, 'get').mockImplementation(() => mockStore);

	// useStore.setのモック
	vi.spyOn(useStore, 'set').mockImplementation((newState) => {
		if (newState.history) {
			// 参照を保ったまま内容だけ更新（スパイが監視している配列の実体を維持）
			mockHistoryData.length = 0;
			mockHistoryData.push(...newState.history);
		}
		return undefined;
	});
});

// テスト後のクリーンアップ
afterEach(() => {
	vi.restoreAllMocks();
});

describe('useConversation', () => {
	it('useConversationは関数であること', () => {
		expect(typeof useConversation).toBe('function');
	});

	it('useConversationはオブジェクトを返すこと', () => {
		const conversation = useConversation();
		expect(typeof conversation).toBe('object');
	});

	it('必要なメソッドが含まれていること', () => {
		const conversation = useConversation();
		expect(typeof conversation.getHistory).toBe('function');
		expect(typeof conversation.clearHistory).toBe('function');
		expect(typeof conversation.addMessage).toBe('function');
		expect(typeof conversation.generateCharacterPrompt).toBe('function');
		expect(typeof conversation.printMessage).toBe('function');
		expect(typeof conversation.wait).toBe('function');
		expect(typeof conversation.runConversation).toBe('function');
	});

	it('generateCharacterPromptは文字列を返すこと', () => {
		const conversation = useConversation();
		const mockCharacter = {
			name: 'テスト用キャラクター',
			persona: 'テスト用の設定です'
		};

		const prompt = conversation.generateCharacterPrompt(mockCharacter);
		expect(typeof prompt).toBe('string');
		expect(prompt).toContain(mockCharacter.name);
		expect(prompt).toContain(mockCharacter.persona);
	});

	it('waitはPromiseを返すこと', () => {
		const conversation = useConversation();
		const waitPromise = conversation.wait(10); // 短い待機時間でテスト
		expect(waitPromise).toBeInstanceOf(Promise);
		return waitPromise; // Promiseが解決するのを待つ
	});
});

describe('runConversation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockHistoryData.length = 0; // 会話履歴をクリア
	});

	it('会話履歴が正しく保存されること', async () => {
		const conversation = useConversation();

		// 会話シミュレーションを実行
		await conversation.runConversation();

		// saveConversationToFileが呼ばれたか確認
		expect(SaveConversationModule.saveConversationToFile).toHaveBeenCalledTimes(1);

		// 引数に最新の会話履歴が渡されているか確認
		const latestHistory = mockStore.history;
		expect(SaveConversationModule.saveConversationToFile).toHaveBeenCalledWith(latestHistory);

		// 会話履歴に正しい数のメッセージが含まれているか確認
		expect(latestHistory.length).toBe(2); // キャラクター2人分の発言
	});

	it('追加された全てのメッセージが保存されること', async () => {
		const conversation = useConversation();

		// 初期メッセージを追加
		const initialMessage: Message = { role: 'system', content: 'テスト開始' };
		conversation.addMessage(initialMessage);

		// 会話シミュレーションを実行
		await conversation.runConversation();

		// 最終的な会話履歴を取得
		const finalHistory = mockStore.history;

		// 初期メッセージを含めて全てのメッセージが保存されているか確認
		expect(finalHistory.length).toBe(3); // 初期メッセージ + キャラクター2人分
		expect(finalHistory[0]).toEqual(initialMessage);
		expect(SaveConversationModule.saveConversationToFile).toHaveBeenCalledWith(finalHistory);
	});
});

describe('addMessage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockHistoryData.length = 0; // 会話履歴をクリア
	});

	it('メッセージが正しく追加されること', () => {
		const conversation = useConversation();
		const message1: Message = { role: 'system', content: '最初のメッセージ' };

		// 1つ目のメッセージを追加
		conversation.addMessage(message1);

		// 履歴に追加されていることを確認
		expect(mockStore.history.length).toBe(1);
		expect(mockStore.history[0]).toEqual(message1);
	});

	it('複数のメッセージが順番通りに累積されること', () => {
		const conversation = useConversation();
		const message1: Message = { role: 'system', content: '最初のメッセージ' };
		const message2: Message = { role: 'assistant', content: '2つ目のメッセージ', speaker: 'テスト' };
		const message3: Message = { role: 'assistant', content: '3つ目のメッセージ', speaker: 'テスト2' };

		// 順番にメッセージを追加
		conversation.addMessage(message1);
		conversation.addMessage(message2);
		conversation.addMessage(message3);

		// 全てのメッセージが順番通りに追加されていることを確認
		const history = mockStore.history;
		expect(history.length).toBe(3);
		expect(history[0]).toEqual(message1);
		expect(history[1]).toEqual(message2);
		expect(history[2]).toEqual(message3);
	});

	it('useConversationを複数回呼び出しても履歴が正しく累積されること', () => {
		// 1つ目のuseConversationインスタンス
		const conversation1 = useConversation();
		const message1: Message = { role: 'system', content: '最初のメッセージ' };
		conversation1.addMessage(message1);

		// 2つ目のuseConversationインスタンス（新しいクロージャ）
		const conversation2 = useConversation();
		const message2: Message = { role: 'assistant', content: '2つ目のメッセージ', speaker: 'テスト' };
		conversation2.addMessage(message2);

		// 履歴が累積されていることを確認（クロージャの罠を回避できているか）
		const history = mockStore.history;
		expect(history.length).toBe(2);
		expect(history[0]).toEqual(message1);
		expect(history[1]).toEqual(message2);
	});
});
