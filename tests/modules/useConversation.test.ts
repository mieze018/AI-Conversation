import { describe, it, expect } from 'vitest';
import { useConversation } from '@/modules/useConversation';

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
