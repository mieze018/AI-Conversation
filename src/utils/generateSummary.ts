import { characterIds, characters } from '@/utils/characters'
import { loadMemory } from '@/utils/memoryManager'

import type { LLMProvider } from '@/types'

/**
 * AIを使って会話の概要を生成する
 */
export async function generateConversationSummary(
  provider: LLMProvider,
): Promise<string> {
  try {
    // 過去のメモリーを取得
    const pastMemories = loadMemory()

    // 要約用のキャラクター定義
    const summarizerCharacter = {
      name: 'Summarizer',
      persona: `- あなたは過去の会話の内容を要約するAIです。
- あなたはAIキャラクターの情報を豊かにし、生き生きとした会話を助けるための情報を提供します。
- 会話履歴を分析し、情報を抽出します。
- Markdown形式で、箇条書きで記述します。
- キャラクターの定量的な背景情報、参加者の関係性などが含まれるとよいでしょう。
- 回答は要約文のみを返してください。余計な説明は不要です。
- 過去の要約を上書きして保存するので、過去の要約内容を引き継いでください。
- なお、次の情報はすでに明らかなので、それ以外の情報を要約してください。: ${getAllCharactersInfo()}
${pastMemories ? `- 過去の会話の要約: ${pastMemories}\n\n` : ''}
`,
    }

    // 要約を生成
    const summaryMessage = await provider.sendMessage(summarizerCharacter)

    return summaryMessage?.content || '要約を生成できませんでした'
  }
  catch (error) {
    console.error('会話要約の生成中にエラーが発生しました:', error)
    return '要約を生成できませんでした'
  }
}

/**
 * すべての参加キャラクターの情報を取得
 */
function getAllCharactersInfo(): string {
  return characterIds.map((id) => {
    const character = characters[id]
    return `- ${character.name}: ${character.persona}`
  },
  ).join('\n\n')
}
