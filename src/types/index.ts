export type ProviderType = 'gemini' | 'chatgpt'
export interface AppState {
  // OpenAI API設定
  openaiApiKey: string
  openaiModel: string

  // Google Gemini API設定
  geminiApiKey: string
  geminiModel: string

  // 会話設定
  providerType: ProviderType
  provider: LLMProvider
  prompt: string
  turns: number
  customInstructions: string
  temperature: number
  maxResponseLength: number
  // 会話履歴
  history: Message[]

}
export interface AppActions {
}
export type AppStore = AppState & AppActions
export interface Character {
  name: string
  persona: string // このキャラクターの性格や口調、背景設定
}
export interface Message {
  role: 'system' | 'user' | 'assistant'
  speaker?: string // 発言者の名前（キャラクター名など）
  content: string
}
export interface LLMProvider {
  /**
   * メッセージを送信してLLMからの応答を取得
   * @param character - 発言するキャラクター
   * @returns 生成されたメッセージ
   */
  sendMessage(
    character: Character,
  ): Promise<Message | null>
}
