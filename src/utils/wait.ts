/**
 * 指定時間待機する
 * @param ms - 待機時間（ミリ秒）
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
