import { useStore } from '@/store'
import { type ProviderType } from '@/types'
import { askUserInput } from '@/utils/askUserInput'
import { hasMemoryFile, loadMemory } from '@/utils/memoryManager'

/**
 * 対話形式でプロバイダを選択する
 * @returns 選択されたプロバイダタイプ
 */
async function selectProvider(): Promise<ProviderType> {
  console.info('使用するAIプロバイダを選択してください:')
  console.info('1. Gemini')
  console.info('2. ChatGPT')

  const defaultProvider = useStore.get().providerType
  const defaultOption = defaultProvider === 'gemini' ? '1' : '2'

  let selection = await askUserInput('番号を入力', defaultOption)

  while (selection !== '1' && selection !== '2') {
    console.info('無効な選択です。1か2を入力してください。')
    selection = await askUserInput('番号を入力', defaultOption)
  }
  const providerType = selection === '1' ? 'gemini' : 'chatgpt'
  return providerType
}

/**
 * 対話形式でターン数を選択する
 * @returns 選択されたターン数
 */
async function selectTurns(): Promise<number> {
  const defaultTurns = useStore.get().turns
  const turnsInput = await askUserInput('会話のターン数を入力してください', `${defaultTurns}`)

  const turns = parseInt(turnsInput, 10)
  if (isNaN(turns) || turns < 1) {
    console.info('無効なターン数です。1以上の数値を入力してください。')
    return selectTurns()
  }
  return turns
}
/**
 * 過去の会話メモリーを読み込むか選択する
 * @param memory - 会話メモリー
 */
async function getMemory(): Promise<string> {
  // 過去の会話メモリーがあるか確認
  if (hasMemoryFile()) {
    const latestMemory = loadMemory()
    if (latestMemory) {
      console.info('前回の会話メモリーが見つかりました:')
      console.info(`前回の会話: ${latestMemory}`)

      // ユーザーに尋ねる
      const shouldReference = await askUserInput(
        '前回の会話を参照して続けますか？ (y/n): ',
        'y',
      )

      if (shouldReference.toLowerCase().startsWith('y')) {
        // 会話の文脈としてメモリーを使用する
        const contextPrompt = `前回の会話の概要: ${latestMemory}\n\nこの会話の文脈を踏まえて、自然な続きの会話をしてください:`
        console.info('前回の会話を参照して会話を続けます。')
        return contextPrompt
      }
      else {
        console.info('前回の会話は参照せず、新しい会話を始めます。')
        return ''
      }
    }
  }
  return ''
}

/**
 * 対話形式で会話プロンプトを取得する
 * @returns 会話の開始プロンプト
 */
async function getConversationPrompt(): Promise<string> {
  const defaultPrompt = useStore.get().prompt
  const prompt = await askUserInput('会話の開始プロンプトを入力してください', defaultPrompt)
  return prompt
}

/**
 * すべての会話設定を対話形式で取得する
 * @param args - コマンドライン引数
 * @returns 会話設定オブジェクト
 */
export async function getConversationSettings(): Promise<void> {
  // プロバイダを対話形式で選択
  const providerType = await selectProvider()

  const memory = await getMemory()
  const prompt = await getConversationPrompt()

  // ターン数を対話形式で選択
  const turns = await selectTurns()

  // ストアに保存
  useStore.set({ providerType, memory, prompt, turns })
}
