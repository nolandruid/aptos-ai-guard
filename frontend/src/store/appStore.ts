import { create } from "zustand"

type RiskScore = "low" | "medium" | "high" | null

interface AppState {
  // Wallet
  walletConnected: boolean
  walletAddress: string | null
  connectWallet: (addr: string) => void
  disconnectWallet: () => void

  // Risk analysis
  riskScore: RiskScore
  loadingRisk: boolean
  setRiskScore: (score: RiskScore) => void
  setLoadingRisk: (loading: boolean) => void

  // Transaction
  txHash: string | null
  setTxHash: (hash: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  walletConnected: false,
  walletAddress: null,
  connectWallet: (addr) => set({ walletConnected: true, walletAddress: addr }),
  disconnectWallet: () => set({ walletConnected: false, walletAddress: null }),

  riskScore: null,
  loadingRisk: false,
  setRiskScore: (score) => set({ riskScore: score }),
  setLoadingRisk: (loading) => set({ loadingRisk: loading }),

  txHash: null,
  setTxHash: (hash) => set({ txHash: hash }),
}))
