import { useState, useEffect } from "react"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aptos?: any
  }
}

export const usePetra = () => {
  const [isPetraInstalled, setIsPetraInstalled] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setIsPetraInstalled(!!window.aptos)
  }, [])

  const connect = async () => {
    if (!window.aptos) {
      throw new Error("Petra Wallet is not installed")
    }

    try {
      const response = await window.aptos.connect()
      setAddress(response.address)
      setConnected(true)
      return response.address
    } catch (error) {
      console.error("Petra connection failed:", error)
      throw error
    }
  }

  const disconnect = async () => {
    if (!window.aptos) return
    try {
      await window.aptos.disconnect()
      setConnected(false)
      setAddress(null)
    } catch (error) {
      console.error("Petra disconnection failed:", error)
    }
  }

  return {
    isPetraInstalled,
    address,
    connected,
    connect,
    disconnect,
  }
}
