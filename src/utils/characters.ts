import fs from 'fs';
import path from 'path';

import { charactersList } from '../../characters/_list.js';

import type { Character } from '@/types';

// マークダウンファイルからキャラクター設定を読み込む関数
function loadCharacterFromFile(characterId: string): string {
	// ルート直下のcharactersディレクトリを参照するように修正
	const filePath = path.join(process.cwd(), 'characters', `${characterId}.md`);
	try {
		return fs.readFileSync(filePath, 'utf-8');
	} catch (error) {
		console.error(`キャラクター設定ファイル ${characterId}.md の読み込みに失敗しました`, error);
		return '';
	}
}

// _list.jsから動的にキャラクター情報を生成
export const characters: Record<string, Character> = Object.entries(charactersList).reduce(
	(acc, [id, info]) => ({
		...acc,
		[id]: {
			name: info.name,
			persona: loadCharacterFromFile(id)
		}
	}),
	{}
);

export const characterIds = Object.keys(characters);
export const characterNames = Object.values(characters).map(character => character.name);

