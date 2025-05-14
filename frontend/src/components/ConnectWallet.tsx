import { usePetra } from "../hooks/usePetra"

export const ConnectWallet = () => {
  const { isPetraInstalled, address, connected, connect, disconnect } = usePetra()

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      {!isPetraInstalled && <p>❌ Petra Wallet not found. Please install it.</p>}

      {connected ? (
        <>
          <p className="text-green-600">✅ Connected: {address?.slice(0, 6)}...</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={connect}
        >
          Connect Petra Wallet
        </button>
      )}
    </div>
  )
}
