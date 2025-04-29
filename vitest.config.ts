/// <reference types="vitest" />
import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		isolate: false, // テスト間の分離を無効化して、テスト間で状態を共有できるようにする
		setupFiles: './tests/setup.ts',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
