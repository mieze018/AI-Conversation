import { afterEach, beforeEach } from 'bun:test'
import * as dotenv from 'dotenv'

// 環境変数をロード
dotenv.config()

// テスト環境のセットアップ
beforeEach(() => {
  // 各テスト前に実行したい共通処理
  // mock.clearAllMocks()
})

// モックのクリーンアップなど
afterEach(() => {
  // 各テスト後に実行したい共通処理
  // Bunのテストランナーはmockのリストアを自動的に行うので、
  // vi.restoreAllMocks()のような処理は不要
})
