import { afterEach, describe, expect, it, mock } from 'bun:test'

import { appStore, useStore } from '@/store'

describe('appStore', () => {
  // 各テスト後にストアをリセットする
  afterEach(() => {
    // ストアを初期状態に戻す
    const initialState = appStore.getInitialState()
    appStore.setState(initialState, true)
  })

  it('初期状態が正しく設定されている', () => {
    // テスト中はモック環境変数が使われることに注意
    const state = appStore.getState()

    expect(state.providerType).toBeDefined()
    expect(state.provider).toBeDefined()
    expect(state.provider.sendMessage).toBeFunction()
    expect(state.turns).toBeNumber()
    expect(state.customInstructions).toBeString()
    expect(state.temperature).toBeNumber()
  })

  it('setState で状態を更新できる', () => {
    // 状態の更新
    appStore.setState({ turns: 10 })

    // 状態が更新されたことを確認
    expect(appStore.getState().turns).toBe(10)
  })

  it('useStore が正しく動作する', () => {
    // get, set, subscribeが存在することを確認
    expect(useStore.get).toBeFunction()
    expect(useStore.set).toBeFunction()
    expect(useStore.subscribe).toBeFunction()

    // 値の取得と設定
    useStore.set({ turns: 15 })
    expect(useStore.get().turns).toBe(15)
  })

  it('subscribe が状態変更を監視できる', () => {
    const callback = mock(() => { })

    // サブスクリプション設定
    const unsubscribe = appStore.subscribe(callback)

    // 状態変更
    appStore.setState({ turns: 20 })

    // コールバックが呼ばれたことを確認
    expect(callback).toHaveBeenCalled()

    // 購読解除
    unsubscribe()

    // 購読解除後は呼ばれないことを確認
    callback.mockClear()
    appStore.setState({ turns: 25 })
    expect(callback).not.toHaveBeenCalled()
  })
})
