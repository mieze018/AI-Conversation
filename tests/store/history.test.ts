import { beforeEach, describe, expect, it } from 'bun:test'

import { historyStore, useHistory } from '@/store'

import type { Message } from '@/types'
describe('historyStore', () => {
  // 各テスト前にヒストリーをクリア
  beforeEach(() => {
    historyStore.setState({ history: [] })
  })

  it('初期状態が空の配列である', () => {
    expect(historyStore.getState().history).toBeArray()
    expect(historyStore.getState().history).toHaveLength(0)
  })

  it('addHistory でメッセージを追加できる', () => {
    const message: Message = { role: 'user', content: 'テストメッセージ' }

    // メッセージを追加
    historyStore.getState().addHistory(message)

    // 履歴に追加されたことを確認
    expect(historyStore.getState().history).toHaveLength(1)
    expect(historyStore.getState().history[0]).toEqual(message)
  })

  it('clearHistory で履歴をクリアできる', () => {
    // メッセージを追加
    historyStore.getState().addHistory({ role: 'user', content: 'メッセージ1' })
    historyStore.getState().addHistory({ role: 'assistant', content: 'メッセージ2' })

    // 履歴が追加されたことを確認
    expect(historyStore.getState().history).toHaveLength(2)

    // 履歴をクリア
    historyStore.getState().clearHistory()

    // 履歴がクリアされたことを確認
    expect(historyStore.getState().history).toHaveLength(0)
  })

  it('getHistory で履歴を取得できる', () => {
    const messages: Message[] = [
      { role: 'user', content: 'メッセージ1' },
      { role: 'assistant', content: 'メッセージ2' },
    ]

    // メッセージを追加
    messages.forEach(msg => historyStore.getState().addHistory(msg))

    // getHistoryで取得
    const history = historyStore.getState().getHistory()

    // 正しく取得できることを確認
    expect(history).toHaveLength(2)
    expect(history).toEqual(messages)
  })

  it('useHistory ユーティリティが正しく動作する', () => {
    // 各メソッドが存在することを確認
    expect(useHistory.get).toBeFunction()
    expect(useHistory.set).toBeFunction()
    expect(useHistory.subscribe).toBeFunction()
    expect(useHistory.addHistory).toBeFunction()
    expect(useHistory.clearHistory).toBeFunction()
    expect(useHistory.getHistory).toBeFunction()

    // 実際の動作確認
    const message: Message = { role: 'user', content: 'テストメッセージ' }
    useHistory.addHistory(message)
    expect(useHistory.getHistory()).toContain(message)

    useHistory.clearHistory()
    expect(useHistory.getHistory()).toHaveLength(0)
  })
})
