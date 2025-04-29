import { describe, it, expect } from 'bun:test'

import { characters, characterIds, characterNames } from '@/utils/characters'

// シンプルな方法でテスト（モックなし）
describe('characters utility', () => {
  it('charactersオブジェクトが存在すること', () => {
    expect(characters).toBeDefined()
    expect(typeof characters).toBe('object')
  })

  it('characterIdsが配列であること', () => {
    expect(Array.isArray(characterIds)).toBe(true)
  })

  it('characterNamesが配列であること', () => {
    expect(Array.isArray(characterNames)).toBe(true)
  })

  it('少なくとも1つのキャラクターが存在すること', () => {
    expect(Object.keys(characters).length).toBeGreaterThan(0)
    expect(characterIds.length).toBeGreaterThan(0)
    expect(characterNames.length).toBeGreaterThan(0)
  })

  it('キャラクター情報が正しい構造を持つこと', () => {
    // 最初のキャラクターを取得
    const firstCharId = Object.keys(characters)[0]
    const firstChar = characters[firstCharId]

    // キャラクター情報に必要なプロパティが存在するか確認
    expect(firstChar).toHaveProperty('name')
    expect(firstChar).toHaveProperty('persona')

    // 型の確認
    expect(typeof firstChar.name).toBe('string')
    expect(typeof firstChar.persona).toBe('string')
  })

  it('characterIdsとcharacterNamesが対応していること', () => {
    // characterIdsの数とcharacterNamesの数が同じであること
    expect(characterIds.length).toBe(characterNames.length)

    // 各キャラクターIDに対応する名前が存在すること
    characterIds.forEach((id) => {
      expect(characters[id]).toBeDefined()
      expect(characterNames).toContain(characters[id].name)
    })
  })
})
