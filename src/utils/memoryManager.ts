import * as fs from 'fs'
import * as path from 'path'

import type { AppStore } from '@/types'

/**
 * メモリーファイルのパスを取得
 */
const getMemoryFilePath = (): string => {
  const distDir = path.join(__dirname, '../../dist')

  // distディレクトリが存在しない場合は作成
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  const memoryDir = path.join(distDir, 'memory')

  // memoryディレクトリが存在しない場合は作成
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true })
  }

  const fileName = 'conversation_memory.md'

  return path.join(memoryDir, fileName)
}

/**
 * メモリーファイルが存在するか確認
 */
export const hasMemoryFile = (): boolean => {
  return fs.existsSync(getMemoryFilePath())
}

/**
 * メモリーを保存
 */
export const saveMemory = (memory: AppStore['memory']): void => {
  try {
    const filePath = getMemoryFilePath()
    const timestamp = new Date().toISOString()
    const memoryData = `${timestamp}\n${memory}\n`
    fs.writeFileSync(filePath, memoryData, 'utf8')
    console.info(`会話メモリーを保存しました: ${filePath}`)
  }
  catch (error) {
    console.error('メモリー保存中にエラーが発生しました:', error)
  }
}

/**
 * メモリーを読み込む
 */
export const loadMemory = (): AppStore['memory'] => {
  try {
    const filePath = getMemoryFilePath()
    if (!fs.existsSync(filePath)) {
      return ''
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return data
  }
  catch (error) {
    console.info('メモリー履歴読み込み中にエラーが発生しました:', error)
    return ''
  }
}
