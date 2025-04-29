import type { Message } from '@/types'

/**
 * メッセージを標準出力に表示
 * @param message - 表示するメッセージ
 * @param turn - 会話の回数
 */
export function printMessage({ message, speakerKey, turn }: {
  message: Message
  speakerKey?: string
  turn: number
}) {
  if (!message.speaker) {
    console.info(`${message.role}: ${message.content}`)
    return
  }

  console.info(`\n<div class="${speakerKey}" count="${turn}">`)
  console.info(`${message.speaker}: ${message.content}`)
  console.info(`</div>`)
}
