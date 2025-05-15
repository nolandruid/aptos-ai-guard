import { create } from "zustand"

export const useMoneyConversionStore = create<{
  cadValue: number | null
  setCadValue: (cadValue: number) => void
}>((set) => ({
  cadValue: null,
  setCadValue: (cadValue) => set({ cadValue }),
}))