import { useStore } from '@/store'
import { characterNames } from '@/utils/characters'

import type { Character } from '@/types'

/**
 * キャラクター用のシステムプロンプトを生成
 * @param character - キャラクター情報
 */
export function generateCharacterPrompt(character: Character): string {
  const { maxResponseLength, customInstructions } = useStore.get()

  return `
- あなたは「${character.name}」というキャラクターです。会話の続きを自然な日本語で発言してください。
- 会話の参加メンバーは${characterNames.join('、')}です。
- あなたの設定: ${character.persona}
  あなたの役割: 会話の流れを考慮して、前の発言に自然に反応してください。会話がスムーズに進むように心がけてください。
- 一度の発言は、${maxResponseLength}文字以内に収めてください。
${customInstructions}
  `
}
