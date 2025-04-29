import { describe, expect, it } from 'bun:test'

import { wait } from '@/utils/wait'

describe('wait', () => {
  it('指定時間後にPromiseが解決されること', async () => {
    const startTime = Date.now()
    const waitTime = 100 // 短い待機時間（ミリ秒）

    await wait(waitTime)

    const endTime = Date.now()
    const elapsedTime = endTime - startTime

    // 少なくとも指定時間は待機していることを確認
    // (タイミングの問題で少し誤差が出ることを考慮)
    expect(elapsedTime).toBeGreaterThanOrEqual(waitTime - 10)
  })
})
