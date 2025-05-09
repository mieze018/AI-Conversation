import { OpenAI } from 'openai'

import { useHistory, useStore } from '@/store'
import { generateCharacterPrompt } from '@/utils/generateCharacterPrompt'

import type { LLMProvider, Message } from '@/types'

/**
 * ChatGPT用のフック
 */
export function useChatGPT(): LLMProvider {
  const sendMessage: LLMProvider['sendMessage'] = async (
    character,
  ): Promise<Message | null> => {
    try {
      // 実行時に最新のデータを取得
      const { openaiApiKey: apiKey, openaiModel: model, temperature, maxResponseLength } = useStore.get()
      const { history } = useHistory.get()
      // APIキーが設定されているか確認

      // OpenAIクライアントを初期化（毎回初期化するのは効率悪いけど、循環参照解決が優先）
      const openai = new OpenAI({ apiKey })

      // システムプロンプトを生成
      const systemPrompt = generateCharacterPrompt(character)

      // 会話にシステムプロンプトを追加
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...history,
      ]

      // OpenAI API呼び出し
      const response = await openai.chat.completions.create({
        model,
        messages: apiMessages.map(msg => ({
          role: msg.role as Message['role'],
          content: msg.content,
        })),
        temperature,
        max_tokens: maxResponseLength,
      })

      const assistantReply = response.choices[0].message.content ?? ''

      // 空の応答でないか確認
      if (!assistantReply || assistantReply.length < 2) {
        console.warn(`Warning: ${character.name} generated an empty or short response.`)
        return null
      }

      // 応答メッセージを作成
      return {
        role: 'assistant',
        speaker: character.name,
        content: assistantReply,
      }
    }
    catch (error) {
      console.error(`Error generating response for ${character.name}:`, error)
      return null
    }
  }

  // LLMプロバイダインターフェースを返す
  return { sendMessage }
}
