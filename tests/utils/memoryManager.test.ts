// filepath: i:\AI Conversation\tests\utils\memoryManager.test.ts
import * as fs from 'fs'

import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { hasMemoryFile, loadMemory, saveMemory } from '@/utils/memoryManager'

// fsモジュールのモック
const mockExistsSync = mock(() => true)
const mockReadFileSync = mock(() => 'テスト用メモリーデータ')
const mockWriteFileSync = mock(() => { })
const mockMkdirSync = mock(() => { })

describe('memoryManager', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    mockExistsSync.mockClear()
    mockReadFileSync.mockClear()
    mockWriteFileSync.mockClear()
    mockMkdirSync.mockClear()

    // fs関数をモック化
    spyOn(fs, 'existsSync').mockImplementation(mockExistsSync)
    spyOn(fs, 'readFileSync').mockImplementation(mockReadFileSync)
    spyOn(fs, 'writeFileSync').mockImplementation(mockWriteFileSync)
    spyOn(fs, 'mkdirSync').mockImplementation(mockMkdirSync)
  })

  describe('hasMemoryFile', () => {
    it('メモリーファイルの存在確認ができるか', () => {
      mockExistsSync.mockImplementation(() => true)
      expect(hasMemoryFile()).toBe(true)

      mockExistsSync.mockImplementation(() => false)
      expect(hasMemoryFile()).toBe(false)

      expect(mockExistsSync).toHaveBeenCalled()
    })
  })

  describe('loadMemory', () => {
    it('メモリーファイルが存在する場合、内容を読み込めるか', () => {
      // テスト用に個別に実装を上書き
      mockExistsSync.mockImplementation(() => true)
      mockReadFileSync.mockImplementation(() => '過去の会話内容')

      const result = loadMemory()
      expect(result).toBe('過去の会話内容')
      expect(mockReadFileSync).toHaveBeenCalled()
    })

    it('メモリーファイルが存在しない場合、空文字を返すか', () => {
      // ファイルが存在しない設定
      mockExistsSync.mockImplementation(() => false)

      const result = loadMemory()
      expect(result).toBe('')
      // ファイルが存在しないので読み込みは呼ばれないはず
      expect(mockReadFileSync).not.toHaveBeenCalled()
    })
  })

  describe('saveMemory', () => {
    it('メモリーを保存できるか', () => {
      // エラーが出ないように実装を変更
      mockExistsSync.mockImplementation(() => true)

      saveMemory('新しい会話内容')

      expect(mockWriteFileSync).toHaveBeenCalled()
      // 第2引数に会話内容が含まれているか確認
      const writeArgs = mockWriteFileSync.mock.calls[0]
      expect(writeArgs[1].includes('新しい会話内容')).toBe(true)
    })

    it('ディレクトリが存在しない場合、作成されるか', () => {
      // 初回はdistディレクトリが存在しないと仮定
      mockExistsSync.mockImplementationOnce(() => false)
      // 2回目はmemoryディレクトリが存在しないと仮定
      mockExistsSync.mockImplementationOnce(() => false)
      // 3回目はファイルチェック用
      mockExistsSync.mockImplementationOnce(() => true)

      saveMemory('テスト')

      // ディレクトリが2回作成されたことを確認（dist, memory）
      expect(mockMkdirSync).toHaveBeenCalledTimes(2)
    })
  })
})
