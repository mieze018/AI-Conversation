import { describe, it, expect } from 'vitest'

import { getConversationSettings } from '@/modules/getSettings'

describe('getConversationSettings', () => {
  it('getConversationSettingsは関数であること', () => {
    expect(typeof getConversationSettings).toBe('function')
  })

  it('getConversationSettingsはPromiseを返すこと', () => {
    // この関数は標準入力を待つので、実際の実行はせずに型だけチェック
    expect(getConversationSettings()).toBeInstanceOf(Promise)

    // テスト実行が終わらないのを防ぐため、すぐに解決するPromiseを返す
    return Promise.resolve()
  })
})
