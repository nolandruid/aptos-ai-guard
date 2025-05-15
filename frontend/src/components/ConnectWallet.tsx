import { usePetra } from "../hooks/usePetra"

export const ConnectWallet = () => {
  const { connect } = usePetra()

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={connect}
        >
         Connect Petra Wallet
        </button>
    </div>
  )
}
