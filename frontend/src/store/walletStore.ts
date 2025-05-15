import { create } from "zustand"

type WalletStatus = "disconnected" | "connecting" | "connected"

interface WalletState {
  status: WalletStatus
  address: string | null

  connect: (address: string) => void
  disconnect: () => void
  setStatus: (status: WalletStatus) => void
  setAddress: (address: string) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  status: "disconnected",
  address: null,

  connect: (address) => set({ status: "connected", address }),
  disconnect: () => set({ status: "disconnected", address: null }),
  setStatus: (status) => set({ status }),
  setAddress: (address) => set({ address }),
}))