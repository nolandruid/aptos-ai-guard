import { create } from "zustand"

export const useRiskStore = create<{
  score: "low" | "medium" | "high" | null
  loading: boolean
  setScore: (s: "low" | "medium" | "high") => void
  setLoading: (l: boolean) => void
}>((set) => ({
  score: null,
  loading: false,
  setScore: (s) => set({ score: s }),
  setLoading: (l) => set({ loading: l }),
}))