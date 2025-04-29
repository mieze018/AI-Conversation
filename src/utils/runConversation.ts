import { useHistory, useStore } from '@/store'
import { characterIds, characters } from '@/utils/characters'
import { generateConversationSummary } from '@/utils/generateSummary'
import { saveMemory } from '@/utils/memoryManager'
import { printMessage } from '@/utils/printMessage'
import { saveConversationToFile } from '@/utils/saveConversationToFile'
import { wait } from '@/utils/wait'

import type { AppStore, Message } from '@/types'

/**
 * キャラクター同士の会話シミュレーションを実行する
 */
export async function runConversation(): Promise<Message[]> {
  const { memory, prompt, turns, provider, turnDelayMs } = useStore.get()
  const { getHistory, addHistory } = useHistory
  console.info('--- 会話シミュレーション開始 ---')
  // メモリーと初期プロンプト履歴に追加。
  if (memory || prompt) {
    const systemContent = [memory, prompt].filter(Boolean).join(' ').trim();
    addHistory({ role: 'system', content: systemContent });
  }

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

  // 会話の要約を生成してメモリーに保存
  console.info('会話の要約を生成しています...')
  const summary = await generateConversationSummary(useStore.get().provider)

  // メモリーに保存
  const newMemory: AppStore['memory'] = summary

  saveMemory(newMemory)
  console.info('会話メモリーを保存しました')

  return currentHistory
}
