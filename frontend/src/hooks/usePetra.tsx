import { useEffect, useState } from "react"
import { useWalletStore } from "../store/walletStore"

declare global {
  interface Window {
    aptos?: any
  }
}

export const usePetra = () => {
  const [isPetraInstalled, setIsPetraInstalled] = useState(false)
  const { setAddress, setStatus, disconnect } = useWalletStore()

  useEffect(() => {
    const wallet = window.aptos
    setIsPetraInstalled(!!wallet)

    const restoreSession = async () => {
      if (!wallet || !wallet.isConnected) return
      const isConnected = await wallet.isConnected()
      if (isConnected) {
        try {
          const account = await wallet.account()
          setAddress(account.address)
          setStatus("connected")
        } catch (e) {
          console.error("Error restoring session:", e)
          setStatus("disconnected")
        }
      }
    }

    const listenAccountChange = () => {
      if (wallet?.onAccountChange) {
        wallet.onAccountChange((newAccount: { address: string }) => {
          setAddress(newAccount.address)
        })
      }
    }

    restoreSession()
    listenAccountChange()
  }, [setAddress, setStatus])

  const connect = async () => {
    const wallet = window.aptos
    if (!wallet) throw new Error("Petra Wallet is not installed")

    try {
      setStatus("connecting")
      await wallet.connect()
      const account = await wallet.account()
      setAddress(account.address)
      setStatus("connected")
      return account.address
    } catch (error) {
      console.error("Petra connection failed:", error)
      setStatus("disconnected")
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      await window.aptos?.disconnect()
      disconnect()
    } catch (error) {
      console.error("Petra disconnection failed:", error)
    }
  }

  return {
    isPetraInstalled,
    connect,
    disconnect: disconnectWallet,
  }
}
