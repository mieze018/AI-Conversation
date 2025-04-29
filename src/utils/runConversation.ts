import { useHistory, useStore } from '@/store'
import { characterIds, characters } from '@/utils/characters'
import { printMessage } from '@/utils/printMessage'
import { saveConversationToFile } from '@/utils/saveConversationToFile'
import { wait } from '@/utils/wait'

import type { Message } from '@/types'

/**
 * キャラクター同士の会話シミュレーションを実行する
 */
export async function runConversation(): Promise<Message[]> {
  const { prompt, turns, provider, turnDelayMs } = useStore.get()
  const { getHistory, addHistory } = useHistory
  console.info('--- 会話シミュレーション開始 ---')
  // 初回の場合、初期プロンプトがあれば履歴に追加
  if (prompt) addHistory({ role: 'system', content: prompt })

  for (let i = 0; i < turns; i++) {
    // 次に話すキャラクターを選択
    const currentSpeakerKey = characterIds[i % characterIds.length]
    const currentSpeaker = characters[currentSpeakerKey]

    if (!currentSpeaker) {
      console.error(`Error: Character not found for key ${currentSpeakerKey}`)
      return getHistory()
    }

    // キャラクターに発言させる
    const newMessage = await provider.sendMessage(currentSpeaker)

    if (newMessage) {
      addHistory(newMessage)
      printMessage({
        message: newMessage,
        speakerKey: currentSpeakerKey,
        turn: i + 1,
      })
    }
    else {
      console.warn(`Warning: ${currentSpeaker.name} generated an invalid response.`)
      // 会話を中断する
      return getHistory()
    }

    // 次のターンの前に待機
    if (i < turns - 1) {
      await wait(turnDelayMs)
    }
  }

  // 最新の会話履歴を取得してから保存
  const currentHistory = getHistory()
  saveConversationToFile(currentHistory)

  return currentHistory
}
