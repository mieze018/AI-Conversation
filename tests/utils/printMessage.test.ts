import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { printMessage } from '@/utils/printMessage'

import type { Message } from '@/types'

// charactersのモック
mock.module('@/utils/characters', () => ({
  characters: {
    neko: { name: 'ねこ', persona: 'ねこのペルソナ' },
    alien: { name: 'ウチュウジン', persona: 'ウチュウジンのペルソナ' },
  },
}))

describe('printMessage', () => {
  // 各テスト前にモックを設定
  beforeEach(() => {
    spyOn(console, 'info').mockRestore()
    spyOn(console, 'info').mockImplementation(() => { })
  })

  it('キャラクターの発言を正しく表示する', () => {
    const message: Message = {
      role: 'assistant',
      speaker: 'ねこ',
      content: 'にゃん',
    }

    printMessage({
      message,
      speakerKey: 'neko',
      turn: 2,
    })

    // コンソール出力の検証
    expect(console.info).toHaveBeenCalled()
    // コンソール出力の検証
    expect(console.info).toHaveBeenNthCalledWith(1, '\n<div class="neko" count="2">')
    expect(console.info).toHaveBeenNthCalledWith(2, 'ねこ: にゃん')
    expect(console.info).toHaveBeenNthCalledWith(3, '</div>')
  })

  it('speakerがない場合はroleとcontentを出力する', () => {
    const message: Message = {
      role: 'system',
      content: 'システムメッセージ',
    }

    printMessage({
      message,
      speakerKey: '',
      turn: 0,
    })

    expect(console.info).toHaveBeenCalled()
    expect(console.info).toHaveBeenNthCalledWith(1, 'system: システムメッセージ')
  })
})
