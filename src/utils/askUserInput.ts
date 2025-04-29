/**
 * 対話形式でユーザーから入力を取得する
 * @param message - 最初に表示するメッセージ
 * @param defaultValue - デフォルト値（何も入力せずEnterを押した場合）
 * @returns ユーザーの入力値
 */
export async function askUserInput(
  message: string,
  defaultValue?: string,
): Promise<string> {
  process.stdout.write(`${message}${defaultValue ? ` (デフォルト: ${defaultValue})` : ''}: `)

  const input = await new Promise<string>((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim())
    })
  })

  return input || defaultValue || ''
}
