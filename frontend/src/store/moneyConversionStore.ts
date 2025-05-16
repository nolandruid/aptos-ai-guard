import { create } from "zustand"

export const useMoneyConversionStore = create<{
  cadValue: number | null
  setCadValue: (cadValue: number) => void
  aptAmount: number | null
  
}>((set) => ({
  cadValue: null,
  setCadValue: (cadValue) => set({ cadValue }),
  aptAmount: null,
  setAptAmount: (aptAmount) => set({ aptAmount }),
}))