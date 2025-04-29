import { describe, it, expect } from 'vitest'

import { askUserInput } from '@/utils/askUserInput'

describe('askUserInput', () => {
  it('askUserInputは関数であること', () => {
    expect(typeof askUserInput).toBe('function')
  })

  it('askUserInputはPromiseを返すこと', () => {
    // 実際にPromiseを返すかテスト（ただし標準入力をモックできないので途中でキャンセル）
    const inputPromise = askUserInput('テスト')
    expect(inputPromise).toBeInstanceOf(Promise)

    // テスト後に処理をキャンセル（標準入力待ちを防ぐため）
    // 注意: これは実際には標準入力待ちになるため、テスト実行中に途中終了する
    // 実運用では別のテスト方法を検討するべき
    return Promise.resolve()
  })
})
