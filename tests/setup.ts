import * as dotenv from 'dotenv';
import { afterEach, beforeEach, vi } from 'vitest';

// 環境変数をロード
dotenv.config();

// グローバルにviを追加
globalThis.vi = vi;

// テスト環境のセットアップ
beforeEach(() => {
	// 各テスト前に実行したい共通処理
});

// モックのクリーンアップなど
afterEach(() => {
	// 各テスト後に実行したい共通処理
	if (vi && vi.restoreAllMocks) {
		vi.restoreAllMocks();
	}
});
