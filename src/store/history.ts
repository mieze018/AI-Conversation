import { createStore } from 'zustand/vanilla'

import type { HistoryStore } from '@/types'

/**
 * 会話履歴ストア
 */
export const historyStore = createStore<HistoryStore>((set, get) => ({
  history: [],
  getHistory: () => get().history,
  addHistory: (message) => {
    set({ history: [...get().history, message] })
  },
  clearHistory: () => set({ history: [] }),
}))

/**
 * historyStore用ユーティリティ
 */
export const useHistory = {
  get: historyStore.getState,
  set: historyStore.setState,
  subscribe: historyStore.subscribe,
  addHistory: historyStore.getState().addHistory,
  clearHistory: historyStore.getState().clearHistory,
  getHistory: historyStore.getState().getHistory,
}
