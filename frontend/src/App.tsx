import './App.css'
import { ConnectWallet } from "./components";
import { TransactionSender } from "./components"
import { usePetra } from "./hooks/usePetra"
import { useWalletStore } from "./store/walletStore"

function App() {

  const { isPetraInstalled } = usePetra()
  const address = useWalletStore((s) => s.address)
  const status = useWalletStore((s) => s.status)

  const needsConnection =
    !isPetraInstalled || !address || status === "disconnected"

  return (
    <>
      { needsConnection ? (
        <ConnectWallet />
      ) : (
        <TransactionSender />
      )}
    </>
  )
}

export default App
