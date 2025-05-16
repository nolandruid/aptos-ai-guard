import { create } from "zustand"

export const useConfidenceScoreStore = create<{
  score: "low" | "medium" | "high" | null
  isScoreLoading: boolean
  setScore: (s: "low" | "medium" | "high") => void
  setIsScoreLoading: (l: boolean) => void
}>((set) => ({
  score: null,
  isScoreLoading: false,
  setScore: (s) => set({ score: s }),
  setIsScoreLoading: (l) => set({ isScoreLoading: l }),
}))