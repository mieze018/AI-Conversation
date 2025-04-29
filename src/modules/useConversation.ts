import { useStore } from '@/store'
import { characterIds, characters } from '@/utils/characters'
import { generateCharacterPrompt } from '@/utils/generateCharacterPrompt'
import { printMessage } from '@/utils/printMessage'
import { saveConversationToFile } from '@/utils/saveConversationToFile'
import { wait } from '@/utils/wait'

import type { Message } from '@/types'

/**
 * 会話履歴を管理
 */
export function useConversation() {
  const { turns, prompt, provider, history, turnDelayMs } = useStore.get()
  const getHistory = () => useStore.get().history
  const clearHistory = () => useStore.set({ history: [] })

  // 常に最新の履歴を取得してから更新するように修正
  const addMessage = (message: Message) => {
    const currentHistory = getHistory()
    useStore.set({ history: [...currentHistory, message] })
  }

  /**
   * キャラクター同士の会話シミュレーションを実行する
   */
  const runConversation = async (): Promise<Message[]> => {
    console.info('--- 会話シミュレーション開始 ---')

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
        addMessage(newMessage)
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

  // 初回の場合、初期プロンプトがあれば履歴に追加
  if (!history.length && prompt) {
    addMessage({ role: 'system', content: prompt })
  }

  // フックのインターフェースを返す
  return {
    getHistory,
    clearHistory,
    addMessage,
    generateCharacterPrompt,
    printMessage,
    saveConversationToFile,
    runConversation,
  }
}
