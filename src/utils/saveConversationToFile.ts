import * as fs from 'fs';
import * as path from 'path';

import type { Message } from '@/types';
/**
 * 会話履歴をJSONファイルとして保存
 */
export const saveConversationToFile = (history: Message[]) => {
	try {
		const formattedDate = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
		const fileName = `conversation_${formattedDate}.json`;
		const distDir = path.join(__dirname, '../../dist');

		// distディレクトリが存在しない場合は作成
		if (!fs.existsSync(distDir)) {
			fs.mkdirSync(distDir, { recursive: true });
		}

		const filePath = path.join(distDir, fileName);
		fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
		console.info(`Conversation history saved to ${filePath}`);
	} catch (error) {
		console.error('Error writing file:', error);
		console.info(history);
	}
};
