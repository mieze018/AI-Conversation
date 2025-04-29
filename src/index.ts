import { getConversationSettings } from '@/modules/getSettings'
import { useChatGPT } from '@/services/useChatGPT'
import { useGemini } from '@/services/useGemini'
import { useStore } from '@/store'
import { characterNames } from '@/utils/characters'
import { runConversation } from '@/utils/runConversation'

// メイン処理
async function startConversation() {
  // 対話形式で会話設定を取得（内部でストアに保存される）
  await getConversationSettings()

  // 会話を開始（設定はストアから取得）
  const { providerType, prompt, turns } = useStore.get()

  console.info(`${providerType}を使って会話を開始します。参加者は${characterNames.join('、')}、会話回数は${turns}回です。`)
  console.info(`プロンプト: "${prompt}"`)

  // プロバイダの初期化
  useStore.set({ provider: useGemini() })
  if (providerType === 'chatgpt') useStore.set({ provider: useChatGPT() })

  // 会話の実行
  await runConversation()

  // 全ての処理が完了したらプロセスを終了
  console.info('会話が終了しました。プログラムを終了します。')
  process.exit(0)
}

// プログラム実行
startConversation().catch((error) => {
  console.error('エラーが発生しました:', error)
})
