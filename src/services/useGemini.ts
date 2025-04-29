import { GoogleGenAI } from '@google/genai'

import { useHistory, useStore } from '@/store'
import { generateCharacterPrompt } from '@/utils/generateCharacterPrompt'

import type { AppState, LLMProvider, Message } from '@/types'

/**
 * Gemini用のフック
 */
export function useGemini(): LLMProvider {
  /**
   * Gemini APIを使用してコンテンツを生成
   * @param contents - プロンプト内容
   * @returns 生成されたコンテンツ
   */
  const generateContent = async (
    contents: AppState['prompt'],
  ) => {
    // 実行時に最新のデータを取得

    const { geminiApiKey: apiKey, geminiModel: model, temperature } = useStore.get()

    // Gemini API クライアントを初期化
    const genAI = new GoogleGenAI({ apiKey })
    if (!genAI) {
      throw new Error('Gemini API client initialization failed.')
    }
    const response = await genAI.models.generateContentStream({
      model: model,
      contents,
      config: {
        temperature: temperature,
      },
    })

    const result: string[] = []
    for await (const chunk of response) {
      result.push(chunk.text || '')
    }
    return { response: result.join('') }
  }

  /**
   * メッセージを送信してGeminiからの応答を取得
   */
  const sendMessage: LLMProvider['sendMessage'] = async (character): Promise<Message | null> => {
    try {
      // 実行時に最新の履歴を取得
      const { history } = useHistory.get()

      // システムプロンプトを生成
      const systemPrompt = generateCharacterPrompt(character)

      // プロンプトを構築
      const prompt = `${systemPrompt}
- これまでの会話は以下の通りです:
${history.map(msg => `${msg.speaker || msg.role}: ${msg.content}`).join('\n')}
`
      // Gemini API を呼び出し
      const result = await generateContent(prompt)
      const text = result.response.trim()

      // 生成されたテキストから発言内容を抽出（形式をある程度強制する）
      const match = text.match(/^[^:]+:\s*(.*)/s) // 「発言者: 」以降を抽出
      const responseText = match ? match[1].trim() : text.trim() // マッチしなければ生成されたテキスト全体を使用

      // 空の発言や無効な発言でないかチェック
      if (!responseText || responseText.length < 2) {
        console.warn(`Warning: Agent ${character.name} generated empty or short response.`)
        return null // 無効な発言として扱う
      }

      // 応答メッセージを作成
      return {
        role: 'assistant',
        speaker: character.name,
        content: responseText,
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
