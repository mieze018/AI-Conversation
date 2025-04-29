import { beforeEach, describe, expect, mock, test } from 'bun:test'

import { appStore, historyStore, useHistory, useStore } from '@/store'

import type { Message } from '@/types'

// モック化
mock.module('dotenv', () => ({
  config: () => { },
}))

describe('appStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    appStore.setState({
      openaiApiKey: '',
      openaiModel: '',
      geminiApiKey: '',
      geminiModel: '',
      providerType: 'gemini',
      prompt: '',
      turns: 5,
      customInstructions: '',
      temperature: 0.7,
      maxResponseLength: 300,
      provider: {
        sendMessage: async () => null,
      },
      turnDelayMs: 1000,
    }, true)
  })

  test('初期値が正しく設定されとるか確認するで', () => {
    const state = appStore.getState()
    expect(state.providerType).toBe('gemini')
    expect(state.turns).toBe(5)
    expect(state.temperature).toBe(0.7)
    expect(state.maxResponseLength).toBe(300)
    expect(state.turnDelayMs).toBe(1000)
    expect(typeof state.provider.sendMessage).toBe('function')
  })

  test('useStore経由で値を取得できるか確認するで', () => {
    expect(useStore.get().providerType).toBe('gemini')
  })

  test('useStore経由で値を更新できるか確認するで', () => {
    useStore.set({ providerType: 'chatgpt' })
    expect(useStore.get().providerType).toBe('chatgpt')
  })

  test('subscribe関数がちゃんと動くか確認するで', () => {
    const mockFn = mock(() => { })
    const unsubscribe = useStore.subscribe(mockFn)

    useStore.set({ turns: 10 })
    expect(mockFn).toHaveBeenCalled()

    unsubscribe()
    useStore.set({ turns: 15 })
    expect(mockFn.mock.calls.length).toBe(1) // 解除した後は呼ばれへん
  })
})

describe('historyStore', () => {
  beforeEach(() => {
    // 履歴ストアをリセット
    historyStore.getState().clearHistory()
  })

  test('初期履歴が空配列になっとるか確認するで', () => {
    expect(historyStore.getState().history).toEqual([])
  })

  test('メッセージを追加できるかチェックや', () => {
    const testMessage: Message = { role: 'user', content: 'こんにちは' }
    useHistory.addHistory(testMessage)
    expect(useHistory.getHistory()).toEqual([testMessage])
  })

  test('複数メッセージが正しく追加されるか見るで', () => {
    const message1: Message = { role: 'user', content: 'テスト1' }
    const message2: Message = { role: 'assistant', content: 'テスト2' }

    useHistory.addHistory(message1)
    useHistory.addHistory(message2)

    expect(useHistory.getHistory()).toEqual([message1, message2])
    expect(useHistory.getHistory().length).toBe(2)
  })

  test('履歴消去が機能するか確認や', () => {
    useHistory.addHistory({ role: 'user', content: 'テスト' })
    expect(useHistory.getHistory().length).toBe(1)

    useHistory.clearHistory()
    expect(useHistory.getHistory().length).toBe(0)
  })

  test('subscribe関数の動作確認するで', () => {
    const mockFn = mock(() => { })
    const unsubscribe = useHistory.subscribe(mockFn)

    useHistory.addHistory({ role: 'user', content: 'テスト' })
    expect(mockFn).toHaveBeenCalled()

    unsubscribe()
    useHistory.addHistory({ role: 'assistant', content: 'テスト2' })
    expect(mockFn.mock.calls.length).toBe(1) // 解除したから1回しか呼ばれへん
  })
})
