// bunfig.js
import { join } from 'path'

export default {
  test: {
    // Jestと互換性のあるAPIを使用
    environment: 'node',
    // テスト間の分離を無効化（vitestのisolate: falseと同じ）
    isolate: false,
    // セットアップファイル
    preload: ['./tests/setup.ts'],
  },
  // パスエイリアス設定
  resolve: {
    alias: {
      '@': join(import.meta.dir, 'src'),
    },
  },
}
